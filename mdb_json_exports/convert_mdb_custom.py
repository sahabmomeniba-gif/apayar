import json, re, hashlib
from pathlib import Path
from datetime import datetime, timezone

PAGE_SIZE = 4096
TYPE_NAMES = {
    0x01: 'BOOLEAN',
    0x02: 'BYTE',
    0x03: 'INT16',
    0x04: 'INT32',
    0x05: 'MONEY_OR_NUMERIC',
    0x06: 'FLOAT32',
    0x07: 'FLOAT64',
    0x08: 'DATETIME',
    0x09: 'BINARY',
    0x0A: 'TEXT',
    0x0B: 'OLE',
    0x0C: 'MEMO',
    0x0F: 'GUID',
}

ALLOWED_CHARS_RE = re.compile(r'[A-Za-z0-9_./:+\-()\[\]{}#@%&=,؛،؟!\u0600-\u06FF ]+')
WORDLIKE_RE = re.compile(r'[A-Za-z0-9_./:+\-()\[\]{}#@%&=,؛،؟!\u0600-\u06FF]{2,}(?: [A-Za-z0-9_./:+\-()\[\]{}#@%&=,؛،؟!\u0600-\u06FF]{1,})*')

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def parse_len_prefixed_utf16(p: bytes, pos: int, max_count: int):
    names = []
    cur = pos
    # Sometimes there is a 2-byte count/marker before names; try direct first.
    for _ in range(max_count):
        if cur + 2 > len(p): break
        ln = int.from_bytes(p[cur:cur+2], 'little')
        if ln <= 0 or ln > 512 or cur + 2 + ln > len(p):
            break
        raw = p[cur+2:cur+2+ln]
        try:
            s = raw.decode('utf-16le', errors='ignore').strip('\x00')
        except Exception:
            break
        if not s:
            break
        names.append(s)
        cur += 2 + ln
    return names

def find_descriptor_start(p: bytes, num_cols: int):
    # Column descriptors in these Jet4 MDB files are 25 bytes and contain marker 59 06 00 00 after type byte.
    candidates = []
    for st in range(0x40, min(0xB0, len(p) - 25*min(num_cols, 2))):
        score = 0
        for i in range(num_cols):
            d = p[st+i*25:st+(i+1)*25]
            if len(d) < 25: break
            if d[1:5] == b'Y\x06\x00\x00' and d[0] in TYPE_NAMES:
                score += 1
        if score >= max(1, min(num_cols, 3)):
            candidates.append((score, st))
    if not candidates:
        return None
    # Prefer highest score; for ties, smallest offset.
    candidates.sort(key=lambda x: (-x[0], x[1]))
    return candidates[0][1]

def extract_utf16_strings(data: bytes):
    found = []
    # Try both even and odd alignments because MDB variable text can begin at odd offsets.
    for align in [0, 1]:
        cur = []
        start = None
        for i in range(align, len(data)-1, 2):
            c = int.from_bytes(data[i:i+2], 'little')
            ch = chr(c) if 0 <= c <= 0x10ffff else ''
            # accept ASCII printable, Persian/Arabic, whitespace and useful punctuation
            if (32 <= c <= 126) or (0x0600 <= c <= 0x06FF) or ch in '\n\r\t':
                if start is None: start = i
                cur.append(ch)
            else:
                if cur:
                    s = ''.join(cur).replace('\x00','').strip()
                    if s:
                        for m in WORDLIKE_RE.finditer(s):
                            t = m.group(0).strip()
                            if len(t) >= 2:
                                found.append({'offset': start, 'encoding': f'utf-16le-align{align}', 'value': t})
                    cur=[]; start=None
        if cur:
            s=''.join(cur).replace('\x00','').strip()
            if s:
                for m in WORDLIKE_RE.finditer(s):
                    t=m.group(0).strip()
                    if len(t)>=2:
                        found.append({'offset': start, 'encoding': f'utf-16le-align{align}', 'value': t})
    # ASCII fragments (for compressed/unicode-compressed Access text and English labels)
    for m in re.finditer(rb'[A-Za-z0-9_./:+\-()\[\]{}#@%&=,]{3,}', data):
        try:
            val = m.group(0).decode('ascii')
        except Exception:
            continue
        found.append({'offset': m.start(), 'encoding': 'ascii', 'value': val})
    # Deduplicate but keep order
    out=[]; seen=set()
    for item in sorted(found, key=lambda x: (x['offset'], x['encoding'], x['value'])):
        key=(item['offset'], item['value'])
        # discard obvious structural filler words made only repeated chars, unless short meaningful code
        if len(set(item['value'])) == 1 and len(item['value']) > 3:
            continue
        if key not in seen:
            seen.add(key); out.append(item)
    return out

def extract_first_string(data: bytes):
    strings = extract_utf16_strings(data)
    def is_bad_mask(v: str) -> bool:
        if re.fullmatch(r'[A-Z0-9]{6,}', v):
            return True
        if re.fullmatch(r'[.,:;<>@A-Z0-9\- ]{6,}', v) and not re.search(r'[a-z_]', v):
            return True
        if re.fullmatch(r'[.,:;<>@]+', v):
            return True
        return False
    # MSysObjects stores the object/table name as a UTF-16 string around offset 32.
    # Prefer that over earlier ASCII fragments such as timestamp/flag bytes.
    for item in strings:
        v=item['value'].strip()
        if item['encoding'].startswith('utf-16le') and item['offset'] >= 28 and len(v) >= 2 and not is_bad_mask(v):
            return v
    for item in strings:
        v=item['value'].strip()
        if len(v) >= 3 and not is_bad_mask(v):
            return v
    return None

def parse_table_names(b: bytes):
    mapping = {}
    ps = PAGE_SIZE
    for pg in range(len(b)//ps):
        p = b[pg*ps:(pg+1)*ps]
        if p[0] != 1: continue
        owner = int.from_bytes(p[4:6], 'little')
        # MSysObjects definition page is usually 2.
        if owner != 2: continue
        rows = int.from_bytes(p[12:14], 'little')
        for idx in range(rows):
            off = int.from_bytes(p[14+2*idx:16+2*idx], 'little') & 0x0fff
            prev = (int.from_bytes(p[14+2*(idx-1):16+2*(idx-1)], 'little') & 0x0fff) if idx > 0 else ps
            if off >= prev or prev > len(p):
                continue
            row = p[off:prev]
            if len(row) < 8: continue
            objid = int.from_bytes(row[2:6], 'little')
            name = extract_first_string(row)
            if name and 0 < objid < 1000000:
                mapping[objid] = name
    return mapping

def parse_columns_from_def_page(p: bytes):
    # In these files byte 0x29 holds the declared column count.
    num_cols = p[0x29] if len(p) > 0x29 else 0
    if not (0 < num_cols < 100):
        return []
    st = find_descriptor_start(p, num_cols)
    if st is None:
        return []
    names_start = st + 25*num_cols
    names = parse_len_prefixed_utf16(p, names_start, num_cols)
    # If parsing fails, search for UTF-16 strings near names_start.
    if len(names) < num_cols:
        # scan length-prefixed candidates in a small window
        best=[]
        for pos in range(max(0, names_start-12), min(len(p), names_start+24)):
            got=parse_len_prefixed_utf16(p, pos, num_cols)
            if len(got)>len(best): best=got
        if len(best)>len(names): names=best
    cols = []
    for i in range(num_cols):
        d = p[st+i*25:st+(i+1)*25]
        if len(d)<25: continue
        typ = d[0]
        col = {
            'index': i,
            'name': names[i] if i < len(names) else f'column_{i}',
            'access_type_code': typ,
            'access_type': TYPE_NAMES.get(typ, f'UNKNOWN_{typ}'),
            'descriptor_hex': d.hex(),
            'fixed_offset': int.from_bytes(d[21:23], 'little'),
            'declared_size': int.from_bytes(d[23:25], 'little'),
            'column_id': int.from_bytes(d[5:7], 'little'),
            'variable_ordinal': int.from_bytes(d[7:9], 'little'),
            'ordinal': int.from_bytes(d[9:11], 'little'),
        }
        cols.append(col)
    return cols

def parse_fixed_values(row: bytes, columns):
    vals = {}
    if len(row) < 2: return vals
    for c in columns:
        typ = c['access_type_code']
        if typ in (0x0A, 0x0B, 0x0C, 0x09, 0x0F):
            continue
        off = 2 + c.get('fixed_offset', 0)
        name = c['name']
        try:
            if typ == 0x01 and off < len(row):
                vals[name] = bool(row[off])
            elif typ == 0x02 and off < len(row):
                vals[name] = row[off]
            elif typ == 0x03 and off+2 <= len(row):
                vals[name] = int.from_bytes(row[off:off+2], 'little', signed=True)
            elif typ == 0x04 and off+4 <= len(row):
                vals[name] = int.from_bytes(row[off:off+4], 'little', signed=True)
            elif typ == 0x06 and off+4 <= len(row):
                import struct
                vals[name] = struct.unpack('<f', row[off:off+4])[0]
            elif typ == 0x07 and off+8 <= len(row):
                import struct
                vals[name] = struct.unpack('<d', row[off:off+8])[0]
            elif typ == 0x08 and off+8 <= len(row):
                import struct
                vals[name] = struct.unpack('<d', row[off:off+8])[0]
            else:
                if off < len(row):
                    vals[name] = {'raw_at_fixed_offset_hex': row[off:off+min(c.get('declared_size',1) or 1,8)].hex()}
        except Exception as e:
            vals[name] = {'parse_error': str(e)}
    return vals

def assign_text_values(row: bytes, columns):
    strings = extract_utf16_strings(row)
    # Use only human-readable values; remove duplicate substrings at same offset preference.
    values = []
    for item in strings:
        v = item['value'].strip()
        if len(v) < 2: continue
        # avoid structural column count isolated gibberish; keep Persian and ASCII meaningful
        if re.fullmatch(r'[0-9]+', v) and len(v) > 6: continue
        values.append(v)
    # Deduplicate by value keeping first occurrence
    uniq=[]; seen=set()
    for v in values:
        if v not in seen:
            seen.add(v); uniq.append(v)
    text_cols = [c for c in columns if c['access_type_code'] in (0x0A, 0x0C)]
    out={}
    # Assign in column order best effort
    for c, v in zip(text_cols, uniq):
        out[c['name']] = v
    return out, strings

def parse_data_rows(b: bytes, owner_page: int, columns):
    ps=PAGE_SIZE
    records=[]
    pages=[]
    global_index=0
    for pg in range(len(b)//ps):
        p=b[pg*ps:(pg+1)*ps]
        if p[0] != 1: continue
        owner=int.from_bytes(p[4:6], 'little')
        if owner != owner_page: continue
        rows=int.from_bytes(p[12:14], 'little')
        pages.append({'page': pg, 'row_count': rows})
        for idx in range(rows):
            off=int.from_bytes(p[14+2*idx:16+2*idx], 'little') & 0x0fff
            prev=(int.from_bytes(p[14+2*(idx-1):16+2*(idx-1)], 'little') & 0x0fff) if idx>0 else ps
            if off >= prev or prev > len(p):
                rec={'_row_index': global_index, '_page': pg, '_slot': idx, '_parse_warning': 'invalid row offset', '_raw_hex': ''}
                records.append(rec); global_index+=1; continue
            row=p[off:prev]
            fixed=parse_fixed_values(row, columns)
            text_assigned, strings=assign_text_values(row, columns)
            values={}
            values.update(fixed)
            # do not overwrite fixed values if same column name; text cols separate
            for k,v in text_assigned.items():
                if k not in values: values[k]=v
                else: values[k+'_text_best_effort']=v
            rec={
                '_row_index': global_index,
                '_page': pg,
                '_slot': idx,
                '_offset': off,
                '_length': len(row),
                '_column_count_byte': int.from_bytes(row[0:2], 'little') if len(row)>=2 else None,
                'values_best_effort': values,
                'text_fragments': strings,
                '_raw_hex': row.hex(),
            }
            records.append(rec)
            global_index+=1
    return pages, records

def convert(path: Path, outpath: Path):
    b=path.read_bytes()
    table_names=parse_table_names(b)
    tables=[]
    for pg in range(len(b)//PAGE_SIZE):
        p=b[pg*PAGE_SIZE:(pg+1)*PAGE_SIZE]
        if p[0] != 2: continue
        cols=parse_columns_from_def_page(p)
        if not cols: continue
        name=table_names.get(pg, f'table_page_{pg}')
        pages, rows=parse_data_rows(b, pg, cols)
        table={
            'name': name,
            'definition_page': pg,
            'declared_row_count_from_definition_page': int.from_bytes(p[0x10:0x14], 'little') if len(p)>0x14 else None,
            'columns': cols,
            'data_pages': pages,
            'row_count_exported': len(rows),
            'rows': rows,
        }
        tables.append(table)
    # Include table name mapping as extracted from MSysObjects too.
    doc={
        'conversion': {
            'tool': 'custom_mdb_binary_extractor',
            'created_utc': datetime.now(timezone.utc).isoformat(),
            'note': 'MDB was converted without mdbtools/Access driver. Each row includes raw_hex to preserve original record bytes; values/text are best-effort parsed from Jet MDB pages.',
        },
        'source_file': {
            'uploaded_name': path.name,
            'size_bytes': len(b),
            'sha256': sha256(b),
            'file_header': b[:32].hex(),
            'access_header_text': b[4:20].decode('latin1', errors='ignore'),
            'page_size_assumed': PAGE_SIZE,
        },
        'msysobjects_table_name_map': {str(k): v for k,v in sorted(table_names.items())},
        'table_count': len(tables),
        'tables': tables,
    }
    outpath.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding='utf-8')
    return doc

if __name__ == '__main__':
    inputs = [
        Path('/mnt/data/SDOC-A6ACC9F6DB6F764C80A10741CE321658-07-01-SI.'),
        Path('/mnt/data/SDOC-3A0BC1FB0B6CACC61FACD4B428825EEF-07-01-SI.'),
    ]
    outs=[]
    for i,p in enumerate(inputs, start=1):
        out=Path(f'/mnt/data/mdb_export_{i}.json')
        doc=convert(p,out)
        outs.append(out)
        print(out, 'tables', doc['table_count'], 'size', out.stat().st_size)
        for t in doc['tables']:
            if t['row_count_exported']:
                print(' ', t['definition_page'], t['name'], 'cols', len(t['columns']), 'rows', t['row_count_exported'])
