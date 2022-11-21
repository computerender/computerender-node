# Node client for [computerender](https://computerender.com)

### Install:  
```npm i computerender```

### Usage:  
```javascript
import fs from "fs";
import {Computerender} from "computerender";

// if no key provided will automatically try CR_KEY env variable
const cr = new Computerender("sk_your_api_key_here");

/* -- text to image -- */
const prompt = "a cow wearing sunglasses";
const imageResult = await cr.generateImage({prompt});

// Optionally write to file 
fs.writeFileSync(prompt + ".jpg", imageResult);

/* -- image to image -- */
const newPrompt = "van gough painting of " + prompt;
const styledResult = await cr.generateImage({prompt: newPrompt, img: imageResult});

// Optionally write to file
fs.writeFileSync(newPrompt + ".jpg", styledResult);
```
"a cow wearing sunglasses"
<img src="https://i.imgur.com/nhEQtQo.jpg" 
alt="a cow wearing sunglasses" width="256"/>  
  
    
"van gough painting of a cow wearing sunglasses"
<img src="https://i.imgur.com/0qV4YB2.jpg" 
alt="van gough painting of a cow wearing sunglasses" width="256"/>

### See more info here:  
https://computerender.com/models-sd.html