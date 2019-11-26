$(document).ready(function() {
    $('#pagepiling').pagepiling({
        sectionsColor: ['white', 'black', 'white', 'white', 'white', 'white', 'white'],
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'fifthPage', 'sixthPage', 'seventhPage', 'eighthPage']
    })

    // Number counter on slide 2
    $('.value').each(function () {
        var $this = $(this);
        jQuery({Counter: 0}).animate({Counter: $this.text()}, {
            duration: 15000,
            easing: 'swing',
            step: function() {
                var num = Math.ceil(this.Counter).toString();
                if(Number(num) > 999){
                    while (/(\d+)(\d{3})/.test(num)) {
                        num = num.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                    }
                }
                $this.text(num);
            }
        });
    });

    // Make one line appear at a time on slide 2
    var lines = $('p').text().split("\n");
    var counter = 18000
    var timer,
        displayLine = function(){
            var nextLine = lines.shift();
            if(nextLine){
                var newLine = $('<li class="line">' + nextLine + '</li>');
                $('#result').append(newLine);
                newLine.animate({ 'margin-left':0 }, 300);
                counter /= 6
                timer = setTimeout(displayLine,counter);
            }
        }
    timer = setTimeout(displayLine,counter);

    //Typewriter effect for title
    var str = "<p>Underage and Under Fire:<p style='color:white; font-size: 80px;'>The growing toll of guns on America's youth</p></p>",
        i = 0,
        isTag,
        text;
    (function type() {
        text = str.slice(0, ++i);
        if (text === str) return;

        document.getElementById('typewriter').innerHTML = text;

        var char = text.slice(-1);
        if( char === '<' ) isTag = true;
        if( char === '>' ) isTag = false;

        if (isTag) return type();
        setTimeout(type, 80);

    }());

});


