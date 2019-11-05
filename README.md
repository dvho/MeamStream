# MemeStream!
_MemeStream!_ is a full stack (MERN) cross-platform iOS/Android messaging app I built in React Native in which users can search GIPHY to drag and drop cool animated layers onto a message canvas.

<img src="https://user-images.githubusercontent.com/45696445/68252567-dcea7700-fff3-11e9-8844-c74cd2ef5068.gif">

_________________________

#### How to Use
Start by searching keywords, scrolling through the options and double-tapping to select an animation to add to your canvas. Switch to another layer by using the arrow keys or by selecting a different layer number in your toolbar. Search for another animation, scroll through the options and double-tap to add the animation of your choice. Continue until you have an action packed canvas full of animations! You can toggle between your canvas and the search option anytime with the toggle switch. Finally, add a few words with the “T” icon and send. You can also send a regular text message by hitting the “T” icon while keeping your animation layers empty. But regular text messages never feel like enough after _MemeStream!_
_________________________

#### Features
- iOS/Android Native Mobile App
- React Native
- GIPHY API with production grade key
- Expo SDK
_________________________

#### Motivation
I wanted to build a full stack messaging app in which users could create entire collages of animations and text. I wanted it to be enterprise grade with a Mongo backend and practically limitless scalability. The way most messaging apps send GIFs is by downloading them first which, in the case of layering many GIFs in a custom collage, would become cumbersome. I made _MemeStream!_ so that it leaves the GIFs themselves on GIPHY's blazing fast servers and merely sends their respective URLs and the x-y positions designated by the sender as relative coefficients calculated in the construction of each message. The ultra lightweight messages, featuring numerous colorful high resolution animations, are then rapidly rendered to scale on the recipient's device.
_________________________

#### Notes
Animate your message with MemeStream!

_________________________

#### License
(MIT)

Copyright (c) 2019 David H. &lt;email6@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
