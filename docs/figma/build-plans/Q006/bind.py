import json
C="44cccc51-37cb-2526-e426-133987071983"; base=0x133987071983
def eid(h): return {"component":C,"element":"44cccc51-37cb-2526-e426-"+format(h,'012x')}
P={"dialog":"e23b2bf6-a467-9c5a-00e4-8cca4596b704","show_heading":"45f37da5-e04c-2e69-e016-b436f6e10f27","heading":"e2471100-edbc-c38a-5506-2a5e31f55180","show_eyebrow":"e2fc2b1e-20f0-b106-5cde-5cd496288c9f","eyebrow":"7319d118-d240-ca86-36e8-071c77d6ce26","show_caption":"e80da905-7b31-ccc1-b332-203b4c3da551","caption":"ceef8a78-7413-ed6a-f295-6383f720ad1a","show_image":"fd8327a1-b43b-9601-550f-57ca05ff7f15","image":"2b110daf-c8da-9c10-90de-11d9e60ddf6d","image_alt":"4628f6b7-785d-3e83-9538-04533d608150","show_sub":"32f936ff-09cf-4113-2425-4813f5babd16","sub":"e5b4574f-6bdb-6bce-7286-ed3379124e68","show_text":"25b55e8c-9b04-ed0a-67dd-2cc4e9799c9d","text":"ed8263d8-512d-01db-9908-80de849cc926","show_extras":"75821e0b-7f4d-aba7-392a-03ee40311a4a","extras_heading":"ec4e1ee7-5094-9fdb-1324-d20350044895","options":"a42a4374-955d-db93-af52-0dab121b2145","extras_link_label":"8ed6e9a4-9e5b-1cc8-4b4e-87aac1cb43f9","extras_link":"8f4fa747-1d57-f372-5513-3199d59c2714","note":"9155a464-1b09-c36c-e59f-54f8019602c2","show_list":"a356125e-e5a2-f525-2473-e7f83bb7db65","show_button":"6232bbb2-a69f-efe8-57b6-6df8ce8a328a","button_label":"fa672abe-c6b3-2171-97c5-e047fcc748c1","button_link":"a7e6f8ec-c149-1429-7496-990c0bcb324a"}
ITEMS=[("897cdaa5-2e1d-8728-ce5c-dc46b52b50d3","5955a3e6-91bb-96f5-1ea6-537e6c04bdee","4a2997af-a88a-82cf-7548-4863fdae218c","c0a1c67d-4b52-ad0d-e0b4-a7d0d640655d","46ca1ef4-3b85-ba2a-d5b7-0f0944a420ab","ab0091f7-da0a-bd04-df61-730104dd6c3b"),
("4e66d812-adf7-7011-ae3e-3bfbadfe822c","6c5110ed-383b-533b-7274-d0ab9a5ccc89","a36f91d1-4d70-02d1-563a-a6cf23d9f6e6","23fb4157-bbfc-3811-51de-0eb9ec2b9648","2c0e6fb0-ed0c-af61-6a1c-c0287a5e201e","ff594a24-2810-caa8-0b1e-b1a463642a52"),
("2b9b24d9-78b4-262c-0b13-79fc0cdf2657","12aa8bc9-178a-ec92-1394-2aea377bf309","2e949c11-ddde-6110-7c1b-bab3490b4b0b","f155ea1c-729d-ba38-f46f-32a25e3ed08f","304badac-6624-e2bc-efda-0ee464689c0e","4b74beef-70e8-3d58-4232-ad6573fa8991"),
("b3f5ca89-c271-4e2d-7414-cadb529ccb7f","ff15f7bf-e640-a214-60e1-838f4776be35","aed90142-a269-f3ef-65a4-3fe99530f28f","af7a9814-2f59-a8e1-5177-5ec20deea5e7","3bd5396e-ba3c-d511-2d2d-d8d8a005282c","8212dc8e-81aa-b843-6f93-59a794cd5361"),
("7361eb45-7d8d-b4d0-3e98-ce7f2ce3bbf7","27a74652-0013-3c7d-5325-417ec5781389","f99805f0-ad5a-6ef3-99c4-1f24d46b049a","3c970df6-a133-28bf-1dae-c4f39d86c491","94c0b3ed-3c91-d7e6-77fa-11c381d8699a","65e02bab-6e8e-ee4c-1360-3c9de2dbf3e2")]
def bnd(k,p): return {"key":k,"binding":{"source_type":"prop","prop_id":p}}
ops=[]
def op(lbl,off,*s): ops.append({"label":lbl,"element_id":eid(base+off),"scope_component_id":C,"settings":list(s)})
op("root",0,bnd("domId",P["dialog"]))
op("heading",0x10,bnd("text",P["heading"]),bnd("visibility",P["show_heading"]))
op("eyebrow",0x12,bnd("text",P["eyebrow"]),bnd("visibility",P["show_eyebrow"]))
op("caption",0x14,bnd("text",P["caption"]),bnd("visibility",P["show_caption"]))
op("figure",0x0c,bnd("visibility",P["show_image"]))
op("image",0x0d,bnd("assetId",P["image"]),bnd("altText",P["image_alt"]))
op("sub",0x18,bnd("text",P["sub"]),bnd("visibility",P["show_sub"]))
op("text",0x1a,bnd("text",P["text"]),bnd("visibility",P["show_text"]))
op("extras",0x1c,bnd("visibility",P["show_extras"]))
op("extras heading",0x1d,bnd("text",P["extras_heading"]))
op("options",0x1f,bnd("text",P["options"]))
op("extras link",0x21,bnd("text",P["extras_link_label"]),bnd("link",P["extras_link"]))
op("note",0x23,bnd("text",P["note"]))
op("list",0x25,bnd("visibility",P["show_list"]))
op("footer",0x67,bnd("visibility",P["show_button"]))
op("button",0x68,bnd("text",P["button_label"]),bnd("link",P["button_link"]))
for i,(show,title,text,img,lbl,link) in enumerate(ITEMS):
  o=0x26+13*i
  op(f"item{i+1}",o,bnd("visibility",show))
  op(f"item{i+1} image",o+2,bnd("assetId",img))
  op(f"item{i+1} title",o+7,bnd("text",title))
  op(f"item{i+1} text",o+9,bnd("text",text))
  op(f"item{i+1} button",o+11,bnd("text",lbl),bnd("link",link))
print(json.dumps([{"label":"bind","set_settings":{"operations":ops}}]))
