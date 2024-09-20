var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link']
        ]
    }
});

document.getElementById('image-button').addEventListener('click', function() {
    const url = prompt('Enter the URL of the image:');
    if (url) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
    }
});

document.getElementById('video-button').addEventListener('click', function() {
    const url = prompt('Enter the URL of the video:');
    if (url) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'video', url);
    }
});

document.getElementById('blogPostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var blogPost = {
        id: Date.now(),
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        summary: document.getElementById('summary').value,
        content: quill.root.innerHTML
    };
    
    var jsonString = JSON.stringify(blogPost, null, 2);
    
    document.getElementById('json-display').textContent = jsonString;
    document.getElementById('json-output').style.display = 'block';
});

document.getElementById('copy-json').addEventListener('click', function() {
    var jsonText = document.getElementById('json-display').textContent;
    navigator.clipboard.writeText(jsonText).then(function() {
        alert('JSON copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});