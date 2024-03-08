import Fields from "./Fields.js";
import {entrypoit, app} from "./builder.js";

entrypoit(()=>{
    let fields = new Fields();

    app.append(fields.getHTML())
})
