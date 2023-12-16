document.addEventListener("DOMContentLoaded", function(){
    let imageTags = document.querySelectorAll('img');

    imageTags.forEach(function(img){
        img.setAttribute('crossorigin', 'anonymous');
    });
});