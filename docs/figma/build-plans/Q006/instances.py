import json
V="58627a5c-9ee5-3e05-ba7c-32f2cfa464f4"; IMG="6ad67011134731ad1b928045"
ids=json.load(open('/dev/stdin')) if False else None
P={"dialog":"e23b2bf6-a467-9c5a-00e4-8cca4596b704","show_heading":"45f37da5-e04c-2e69-e016-b436f6e10f27","heading":"e2471100-edbc-c38a-5506-2a5e31f55180","show_eyebrow":"e2fc2b1e-20f0-b106-5cde-5cd496288c9f","eyebrow":"7319d118-d240-ca86-36e8-071c77d6ce26","show_caption":"e80da905-7b31-ccc1-b332-203b4c3da551","image":"2b110daf-c8da-9c10-90de-11d9e60ddf6d","show_sub":"32f936ff-09cf-4113-2425-4813f5babd16","show_text":"25b55e8c-9b04-ed0a-67dd-2cc4e9799c9d","text":"ed8263d8-512d-01db-9908-80de849cc926","show_extras":"75821e0b-7f4d-aba7-392a-03ee40311a4a","show_list":"a356125e-e5a2-f525-2473-e7f83bb7db65","show_button":"6232bbb2-a69f-efe8-57b6-6df8ce8a328a","button_label":"fa672abe-c6b3-2171-97c5-e047fcc748c1"}
ITEM=[{"show":"897cdaa5-2e1d-8728-ce5c-dc46b52b50d3","title":"5955a3e6-91bb-96f5-1ea6-537e6c04bdee","text":"4a2997af-a88a-82cf-7548-4863fdae218c","image":"c0a1c67d-4b52-ad0d-e0b4-a7d0d640655d","label":"46ca1ef4-3b85-ba2a-d5b7-0f0944a420ab"},
{"show":"4e66d812-adf7-7011-ae3e-3bfbadfe822c","title":"6c5110ed-383b-533b-7274-d0ab9a5ccc89","text":"a36f91d1-4d70-02d1-563a-a6cf23d9f6e6","image":"23fb4157-bbfc-3811-51de-0eb9ec2b9648","label":"2c0e6fb0-ed0c-af61-6a1c-c0287a5e201e"},
{"show":"2b9b24d9-78b4-262c-0b13-79fc0cdf2657","title":"12aa8bc9-178a-ec92-1394-2aea377bf309","text":"2e949c11-ddde-6110-7c1b-bab3490b4b0b","image":"f155ea1c-729d-ba38-f46f-32a25e3ed08f","label":"304badac-6624-e2bc-efda-0ee464689c0e"},
{"show":"b3f5ca89-c271-4e2d-7414-cadb529ccb7f","title":"ff15f7bf-e640-a214-60e1-838f4776be35","text":"aed90142-a269-f3ef-65a4-3fe99530f28f","image":"af7a9814-2f59-a8e1-5177-5ec20deea5e7","label":"3bd5396e-ba3c-d511-2d2d-d8d8a005282c"},
{"show":"7361eb45-7d8d-b4d0-3e98-ce7f2ce3bbf7"}]
VAR={"Dark":"569f778f-307a-cdc2-95c3-95b18a7c2c5c","Image Bg":"72048989-461a-61a0-ac02-cfc3ae7b6e5c","Burgundy":"0e56f707-a8b4-d396-c73a-900ce080b5db","Centered":"34ca996d-2f65-a59e-6eb0-09dd065e4534"}
S=lambda p,v:{"prop_id":p,"type":"string","string_value":v}
B=lambda p,v:{"prop_id":p,"type":"boolean","boolean_value":v}
def off(*keys): return [B(P[k],False) for k in keys]
PAGE="6ad7885b7f5d5d50523f997f"
INST={
 "cf2fe55e-cdf5-26fe-5f96-631cf4ecf5ae":[S(P["dialog"],"meetings-overlay"),S(P["image"],IMG)],
 "848fb687-8e79-d951-3bdd-db812bee1eaa":[S(V,VAR["Dark"]),S(P["dialog"],"arts-artist"),S(P["image"],IMG),S(P["heading"],"eva struble"),
   S(P["text"],"Eva Struble is a San Diego-based artist whose work examines landscape through social, environmental, and personal histories. Her practice explores human-altered environments, regional botany, and the ways nature and human intervention continually reshape one another.")]+off("show_sub","show_extras","show_list","show_button"),
 "4070950d-e9b6-e1a0-be10-2cad46b7301c":[S(V,VAR["Dark"]),S(P["dialog"],"arts-artwork"),S(P["image"],IMG),S(P["heading"],"‘oceano’"),B(P["show_eyebrow"],True),B(P["show_caption"],True),
   S(P["text"],"Eva’s work unfolds through layered color, texture, and abstraction, conjuring the atmospheric qualities of a coastal landscape without settling into a singular representation of place. The work speaks to the deep relationship between landscape and the daily life of Southern California, where the natural environment is not simply a backdrop, but integral of how the region is experienced, remembered, and understood.")]+off("show_sub","show_extras","show_list","show_button"),
 "bc54145c-c79d-fac3-6327-73cc22608018":[S(V,VAR["Image Bg"]),S(P["dialog"],"dining-menu"),S(P["image"],IMG),S(P["heading"],"dining")]+off("show_heading","show_sub","show_text","show_extras","show_button")+
   sum([[S(ITEM[i]["title"],t),S(ITEM[i]["text"],x),S(ITEM[i]["image"],IMG)] for i,(t,x) in enumerate([("zuma","Contemporary Japanese dining."),("the lobby bar","Cocktails, light bites and an intimate atmosphere."),("the courtyard","Flexible spaces for meetings, celebrations, and everything worth gathering for."),("the pool","Flexible spaces for meetings, celebrations, and everything worth gathering for.")])],[])+[B(ITEM[4]["show"],False)],
 "36e49588-ba7a-a994-ce5b-c879c63f0a74":[S(V,VAR["Burgundy"]),S(P["dialog"],"book-menu"),S(P["image"],IMG),S(P["heading"],"book")]+off("show_heading","show_sub","show_text","show_extras","show_button")+
   [S(ITEM[i]["label"],l) for i,l in enumerate(["book a stay","reserve a table","host an event","book an appointment"])]+[B(ITEM[4]["show"],False)],
 "694c0cf5-e261-ec58-9cdb-598885d9b497":[S(V,VAR["Centered"]),S(P["dialog"],"neighborhood-overlay"),S(P["heading"],"coronado beach"),S(P["button_label"],"learn more"),
   S(P["text"],"Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa. Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa.")]+off("show_sub","show_extras","show_list"),
}
acts=[{"label":k[:8],"set_component_instance_prop_values":{"element_id":{"component":PAGE,"element":k},"values":v}} for k,v in INST.items()]
print(json.dumps(acts,ensure_ascii=False))
