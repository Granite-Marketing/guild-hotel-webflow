"""K01 check: every class a plan uses is live, shared (shared-classes.json) or in the plan family; every var() is a live name.
Run: python3 docs/figma/build-plans/k01-check.py"""
import json,re,sys,glob
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=json.load(open('shared-classes.json'))
live=set(json.load(open('live-style-names.json'))['names'])|set(S['builtIns'])
shared={x['name'] for x in S['shared']}
CK=('classes','altClasses','optionalClasses','headingClasses','captionClasses')
ok=True
for p in sorted(glob.glob('Q0*/plan.json')):
    q=p.split('/')[0]; d=json.load(open(p))
    fam={f['name'] for f in d['familyClasses']}
    mods=set()
    for v in d.get('variants',[]):
        if isinstance(v.get('modifier'),str): mods.update(x for x in re.split(r'[ +]+',v['modifier']) if x)
    used=set()
    def w(n):
        if isinstance(n,dict):
            for k,v in n.items():
                if k in CK and isinstance(v,list): used.update(v)
                elif k in CK and isinstance(v,dict):
                    for s in v.values():
                        if isinstance(s,str): used.update(s.split())
                        elif isinstance(s,list): used.update(s)
                else: w(v)
        elif isinstance(n,list): [w(x) for x in n]
    w(d['tree']); w(d.get('instances',[]))
    for v in d.get('variants',[]):
        for s in (v.get('alsoApplies') or {}).values():
            used.update(re.sub(r'\(.*\)','',s).split() if isinstance(s,str) else s)
    for i in d.get('instances',[]):
        for s in (i.get('classOverrides') or {}).values():
            used.update(s.split() if isinstance(s,str) else s)
    used|=mods
    bad=sorted(x for x in used if x not in live|shared|fam|mods)
    psn={x['name'] for x in d['proposedShared']}
    bad2=sorted(x for x in used if x in shared and x not in live and x not in fam and x not in psn and x not in mods)
    vars_=set(re.findall(r'var\((--[a-zA-Z0-9_-]+)\)',json.dumps(d)))
    badv=sorted(v for v in vars_ if not v.startswith(('--_primitives---colors--','--_typography---font-styles--')))
    print(q,'unknown:',bad,'| shared not listed:',bad2,'| vars:',badv)
    ok&= not bad and not bad2 and not badv
print('PASS' if ok else 'FAIL')
