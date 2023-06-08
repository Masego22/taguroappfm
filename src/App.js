import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const idCardRef = useRef();
  const selfieRef = useRef();
  const [faceMatched, setFaceMatched] = useState('')
  const observerRef = useRef()
  // const [debug1, setDebug1] = useState('');
  // const [debug2, setDebug2] = useState('');
  // const [debug3, setDebug3] = useState('');
  // const [debug4, setDebug4] = useState('');
  const [cardFace, setCardFace] = useState(false)
  const [selfieFace, setSelfieFace] = useState(false)

  useEffect(() => {
  
    const idNode = document.getElementById('cardImage')
    const selfieNode = document.getElementById('selfieImage')
   

    const config = {attributes: true, childList:true, subtree: true};

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList){
        if(mutation.type === "attributes"){
          console.log("src is altered")
          const selfieSrc = selfieNode.src;
          const idSrc = idNode.src;
          performFaceDetection(selfieSrc, idSrc);
        }
      }
    }

    const observer = new MutationObserver(callback);

    observer.observe(idNode, config)
    observer.observe(selfieNode, config)
  }, []);

  console.log("Testing")


  const performFaceDetection = async (selfieSrc, idSrc) => {
    try {
      console.log("We reached here")
      
      console.log(selfieSrc)
      console.log(idSrc)
      // loading the models
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://masego22.github.io/taguroappfm/models');
      await faceapi.nets.tinyFaceDetector.loadFromUri('https://masego22.github.io/taguroappfm/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://masego22.github.io/taguroappfm/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://masego22.github.io/taguroappfm/models');

      // detect a single face from the ID card image
      const selfieImage = await faceapi.fetchImage(selfieSrc)
      const cardImage = await faceapi.fetchImage(idSrc)

      const idCardFacedetection = await faceapi.detectSingleFace(cardImage,
        new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptor();

      // detect a single face from the selfie image
      const selfieFacedetection = await faceapi.detectSingleFace(selfieImage,
        new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptor();
      
      if(idCardFacedetection && selfieFacedetection){
        setCardFace(true)
        setSelfieFace(true)
      }else{
        const data = {
          distance: faceMatched,
          cardFace: cardFace,
          selfieFace: selfieFace,
        }
        const serializeData = JSON.stringify(data)
        window.ReactNativeWebView.postMessage(serializeData)
      }

      if (idCardFacedetection && selfieFacedetection) {
        // Using Euclidean distance to compare face descriptions
        const distance = faceapi.euclideanDistance(idCardFacedetection.descriptor, selfieFacedetection.descriptor);
        console.log(distance);
        // setDebug3(distance)
        // setDebug4("Face Matched")

        setFaceMatched(distance)
        if (distance <= 0.55) {
          console.log("Face Matched");
        }
        // window.postMessage(distance)

      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if(faceMatched){
    const data = {
      distance: faceMatched,
      cardFace: cardFace,
      selfieFace: selfieFace,
    }
    const serializeData = JSON.stringify(data)
    window.ReactNativeWebView.postMessage(serializeData)
  }

 

  return (
    <>
      <div className="gallery">
        <img ref={idCardRef} className='hidden' id="cardImage" src={require('./images/img3.jpg')} alt="ID card" height="0" />
      </div>

      <div className="gallery">
        <img ref={selfieRef} className='hidden' id="selfieImage" src={require('./images/img2.jpg')} alt="Selfie" height="0" />
      </div>
    </>
  );
}


export default App;