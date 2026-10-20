import json
def t(name, group, val, multiline=False): return {"type":"textContent","name":name,"group":group,"default_text":{"value":val,**({"multiline":True} if multiline else {})}}
def b(name, group, val): return {"type":"boolean","name":name,"group":group,"default_boolean":{"value":val}}
def l(name, group): return {"type":"link","name":name,"group":group,"default_link":{"mode":"url","to":"#"}}
P=[{"type":"id","name":"Dialog id","group":"Dialog","tooltip":"Must match the trigger's data-modal-open value"},
 b("Show heading","Header",True), t("Heading","Header","council boardroom"),
 b("Show eyebrow","Header",False), t("Eyebrow","Header","by eva struble"),
 b("Show caption","Header",False), t("Caption","Header","2024 | 48 x 60 in\nOil and acrylic on canvas",True),
 b("Show image","Media",True), {"type":"image","name":"Image","group":"Media"}, {"type":"altText","name":"Image alt","group":"Media"},
 b("Show subheading","Body",True), t("Subheading","Body","details"),
 b("Show text","Body",True), t("Text","Body","Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa. Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa.",True),
 b("Show extras","Extras",True), t("Extras heading","Extras","layout options"),
 t("Options","Extras","Classroom: 21*\nU-shape: 21\nRounds: 21\nTheater: 21\nConference: 21*\nReception: 21",True),
 t("Extras link label","Extras","floorplan"), l("Extras link","Extras"), t("Note","Extras","*requires furniture removal, charges may apply"),
 b("Show list","List",True),
 b("Show button","Button",True), t("Button label","Button","submit your request"), l("Button link","Button")]
ITEMS=[("510 SQ FT","Contemporary Japanese dining."),("Modern executive seating for 12","Cocktails, light bites and an intimate atmosphere."),("Premium conference table with ultra connectivity","Flexible spaces for meetings, celebrations, and everything worth gathering for."),("Oversized, built-in hi-res TV","Flexible spaces for meetings, celebrations, and everything worth gathering for."),("Capacity: 50+","Flexible spaces for meetings, celebrations, and everything worth gathering for.")]
for i,(ti,tx) in enumerate(ITEMS,1):
  g=f"Item {i}"
  P+= [b(f"Show item {i}",g,True), t(f"Item {i} title",g,ti), t(f"Item {i} text",g,tx,True), {"type":"image","name":f"Item {i} image","group":g}, t(f"Item {i} button label",g,"reserve"), l(f"Item {i} link",g)]
print(len(P)); open('/tmp/q006-props.json','w').write(json.dumps(P))
