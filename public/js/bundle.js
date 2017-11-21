console.log('load')

function AjaxFileUpload() {
    //var file = document.getElementById("files")
    var input = document.querySelector('input[type="file"]')
    //var file = fileInput;
    var fd = new FormData()    
    fd.append('sampleFile', input.files[0])
    //fd.append("sampleFile", file)

    Promise.all([
        fetch('http://localhost:3000/upload',{method: 'POST', body:fd }).then(res => res.json())
        ]
    ).then(arr => {
        console.log(arr[0])
        fetch('http://localhost:3000/img/'+arr[0],{method: 'GET'}).then(res => res.json().then(data =>{
            console.log(data)
            loadImage(data)
        }))
    }).catch(err => {
        console.log(err)
    })
    /*
    fetch('http://localhost:3000/upload',{method: 'POST', body:fd })
        .then(res => {
            res.status === 200 ? res.json().then( data => {
                 //console.log(data) 
            }) : console.log('error')
        })
    */
}

function loadImage(data){
    var base64Flag = 'data:image/jpeg;base64,';
    var imageStr = arrayBufferToBase64(data.data);

    var outputImg = document.createElement('img')

    outputImg.src = base64Flag + imageStr;

    document.body.appendChild(outputImg)
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
  
    bytes.forEach((b) => binary += String.fromCharCode(b));
  
    return window.btoa(binary);
}