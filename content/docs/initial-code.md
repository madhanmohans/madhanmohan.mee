```
import React, { useState, useEffect } from 'react';

import { Palette, Download, RotateCcw, Copy, Settings, Smartphone } from 'lucide-react';

  

const IconCustomizer = () => {

const [selectedIcon, setSelectedIcon] = useState(0);

const [hslaValues, setHslaValues] = useState({

hue: 200,

saturation: 70,

lightness: 50,

alpha: 1

});

const [cornerRadius, setCornerRadius] = useState(20);

const [shadowIntensity, setShadowIntensity] = useState(30);

const [gradientEnabled, setGradientEnabled] = useState(false);

const [gradientAngle, setGradientAngle] = useState(45);

  

// Sample iOS app icon shapes - using SVG paths for common app types

const iconShapes = [

{

name: 'Camera',

path: 'M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z'

},

{

name: 'Settings',

path: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'

},

{

name: 'Music',

path: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'

},

{

name: 'Mail',

path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'

},

{

name: 'Phone',

path: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'

},

{

name: 'Calculator',

path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H9v-2h5v2zm0-3H9v-2h5v2zm0-3H9V9h5v2zm3 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V9h2v2zm0-3H6V6h11v2z'

}

];

  

const generateHSLA = () => {

const { hue, saturation, lightness, alpha } = hslaValues;

return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

};

  

const generateGradient = () => {

if (!gradientEnabled) return generateHSLA();

const baseColor = generateHSLA();

const lighterColor = `hsla(${hslaValues.hue}, ${hslaValues.saturation}%, ${Math.min(hslaValues.lightness + 20, 100)}%, ${hslaValues.alpha})`;

return `linear-gradient(${gradientAngle}deg, ${baseColor}, ${lighterColor})`;

};

  

const copyColorValue = () => {

navigator.clipboard.writeText(generateHSLA());

};

  

const resetValues = () => {

setHslaValues({ hue: 200, saturation: 70, lightness: 50, alpha: 1 });

setCornerRadius(20);

setShadowIntensity(30);

setGradientEnabled(false);

setGradientAngle(45);

};

  

const exportIcon = () => {

// In a real app, this would generate and save the icon

alert('Icon exported! (In a real app, this would save the customized icon)');

};

  

return (

<div className="min-h-screen bg-gray-100 p-4">

<div className="max-w-6xl mx-auto">

{/* Header */}

<div className="bg-white rounded-xl shadow-sm p-6 mb-6">

<div className="flex items-center justify-between">

<div className="flex items-center space-x-3">

<Smartphone className="w-8 h-8 text-blue-600" />

<h1 className="text-2xl font-bold text-gray-900">iOS Icon Customizer</h1>

</div>

<div className="flex space-x-2">

<button

onClick={resetValues}

className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"

>

<RotateCcw className="w-4 h-4" />

<span>Reset</span>

</button>

<button

onClick={exportIcon}

className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"

>

<Download className="w-4 h-4" />

<span>Export</span>

</button>

</div>

</div>

</div>

  

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* Icon Selection */}

<div className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">

<Settings className="w-5 h-5 mr-2" />

Select Icon

</h2>

<div className="grid grid-cols-2 gap-3">

{iconShapes.map((icon, index) => (

<button

key={index}

onClick={() => setSelectedIcon(index)}

className={`p-4 rounded-xl border-2 transition-all ${

selectedIcon === index

? 'border-blue-500 bg-blue-50'

: 'border-gray-200 hover:border-gray-300'

}`}

>

<div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-200 flex items-center justify-center">

<svg

viewBox="0 0 24 24"

className="w-6 h-6 fill-gray-600"

>

<path d={icon.path} />

</svg>

</div>

<span className="text-sm font-medium text-gray-700">{icon.name}</span>

</button>

))}

</div>

</div>

  

{/* Controls */}

<div className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">

<Palette className="w-5 h-5 mr-2" />

Customize

</h2>

<div className="space-y-6">

{/* HSLA Controls */}

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Hue: {hslaValues.hue}°

</label>

<input

type="range"

min="0"

max="360"

value={hslaValues.hue}

onChange={(e) => setHslaValues({...hslaValues, hue: parseInt(e.target.value)})}

className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"

/>

</div>

  

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Saturation: {hslaValues.saturation}%

</label>

<input

type="range"

min="0"

max="100"

value={hslaValues.saturation}

onChange={(e) => setHslaValues({...hslaValues, saturation: parseInt(e.target.value)})}

className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"

/>

</div>

  

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Lightness: {hslaValues.lightness}%

</label>

<input

type="range"

min="0"

max="100"

value={hslaValues.lightness}

onChange={(e) => setHslaValues({...hslaValues, lightness: parseInt(e.target.value)})}

className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"

/>

</div>

  

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Alpha: {hslaValues.alpha}

</label>

<input

type="range"

min="0"

max="1"

step="0.1"

value={hslaValues.alpha}

onChange={(e) => setHslaValues({...hslaValues, alpha: parseFloat(e.target.value)})}

className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"

/>

</div>

  

{/* Additional Controls */}

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Corner Radius: {cornerRadius}px

</label>

<input

type="range"

min="0"

max="50"

value={cornerRadius}

onChange={(e) => setCornerRadius(parseInt(e.target.value))}

className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"

/>

</div>

  

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Shadow Intensity: {shadowIntensity}%

</label>

<input

type="range"

min="0"

max="100"

value={shadowIntensity}

onChange={(e) => setShadowIntensity(parseInt(e.target.value))}

className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"

/>

</div>

  

{/* Gradient Toggle */}

<div className="flex items-center justify-between">

<label className="text-sm font-medium text-gray-700">Enable Gradient</label>

<button

onClick={() => setGradientEnabled(!gradientEnabled)}

className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${

gradientEnabled ? 'bg-blue-600' : 'bg-gray-200'

}`}

>

<span

className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${

gradientEnabled ? 'translate-x-6' : 'translate-x-1'

}`}

/>

</button>

</div>

  

{gradientEnabled && (

<div>

<label className="block text-sm font-medium text-gray-700 mb-2">

Gradient Angle: {gradientAngle}°

</label>

<input

type="range"

min="0"

max="360"

value={gradientAngle}

onChange={(e) => setGradientAngle(parseInt(e.target.value))}

className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"

/>

</div>

)}

  

{/* Color Value Display */}

<div className="bg-gray-50 p-3 rounded-lg">

<div className="flex items-center justify-between mb-2">

<span className="text-sm font-medium text-gray-700">HSLA Value:</span>

<button

onClick={copyColorValue}

className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"

>

<Copy className="w-3 h-3" />

<span>Copy</span>

</button>

</div>

<code className="text-xs bg-white p-2 rounded border text-gray-800 font-mono block">

{generateHSLA()}

</code>

</div>

</div>

</div>

  

{/* Preview */}

<div className="bg-white rounded-xl shadow-sm p-6">

<h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

{/* iOS Home Screen Mockup */}

<div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 mb-4">

<div className="grid grid-cols-4 gap-4">

{/* Sample app icons */}

{[...Array(8)].map((_, index) => (

<div

key={index}

className={`w-16 h-16 rounded-xl ${

index === 0 ? '' : 'bg-white bg-opacity-20'

} flex items-center justify-center shadow-lg`}

style={index === 0 ? {

background: generateGradient(),

borderRadius: `${cornerRadius}px`,

boxShadow: `0 4px 20px rgba(0,0,0,${shadowIntensity / 100})`

} : {}}

>

{index === 0 ? (

<svg

viewBox="0 0 24 24"

className="w-8 h-8 fill-white"

>

<path d={iconShapes[selectedIcon].path} />

</svg>

) : (

<div className="w-6 h-6 bg-white bg-opacity-40 rounded"></div>

)}

</div>

))}

</div>

</div>

  

{/* Large Icon Preview */}

<div className="flex justify-center">

<div

className="w-32 h-32 flex items-center justify-center shadow-2xl"

style={{

background: generateGradient(),

borderRadius: `${cornerRadius * 1.5}px`,

boxShadow: `0 8px 40px rgba(0,0,0,${shadowIntensity / 100})`

}}

>

<svg

viewBox="0 0 24 24"

className="w-16 h-16 fill-white"

>

<path d={iconShapes[selectedIcon].path} />

</svg>

</div>

</div>

</div>

</div>

</div>

</div>

);

};

  

export default IconCustomizer;
```