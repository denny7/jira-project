$(document).ready(function() {

    var active1 = false;
    var active2 = false;
    var active3 = false;
    var active4 = false;

    $('.parent').on('mousedown touchstart', function() {

        if (!active1) $(this).find('.homeIcon').css({ 'background-color': '#369FC8', 'transform': 'translate(0px,125px)' });
        else $(this).find('.homeIcon').css({ 'background-color': '#369FC8', 'transform': 'none' });
        if (!active2) $(this).find('.listIcon').css({ 'background-color': '#4E8E15', 'transform': 'translate(60px,105px)' });
        else $(this).find('.listIcon').css({ 'background-color': '#4E8E15', 'transform': 'none' });
        if (!active3) $(this).find('.userIcon').css({ 'background-color': '#DC3089', 'transform': 'translate(105px,60px)' });
        else $(this).find('.userIcon').css({ 'background-color': '#DC3089', 'transform': 'none' });
        if (!active4) $(this).find('.plusIcon').css({ 'background-color': '#dba606', 'transform': 'translate(125px,0px)' });
        else $(this).find('.plusIcon').css({ 'background-color': '#dba606', 'transform': 'none' });
        active1 = !active1;
        active2 = !active2;
        active3 = !active3;
        active4 = !active4;

    });

});