# Node client for [computerender](https://computerender.com)

### Install:  
```npm i computerender```

### Usage:  
```javascript
import {Computerender} from "computerender";

const cr = new Computerender("sk_your_api_key_here");
const prompt = "cat with sunglasses";
const imageResult = await cr.generateImage({prompt});

// Optionally write to file 
imageResult.pipe(fs.createWriteStream(prompt + ".jpg"));
```
<img src="https://api.computerender.com/generate/cat-with-sunglasses.jpg" 
alt="cat" width="256"/>

### See more info here:  
https://computerender.com/models-sd.html