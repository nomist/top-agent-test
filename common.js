$(document).ready(function() {

  var countPlayers = 100,
      startPage = 0;

  $('#search-btn').on('click', function() {
    var searchRequest = $('#search').val();
    console.log(searchRequest);
    $.ajax({
      type: "GET",
      url: "http://localhost:20000/api/v1/players?search=" + searchRequest + "&start=0&n=" + countPlayers + "",
      dataType: "json",
      success: render
    });
  });

  $.ajax({
    type: "GET",
    url: "http://localhost:20000/api/v1/players?start=" + startPage + "&n=" + countPlayers + "",
    dataType: "json",
    success: render
  }).then(function(data, textStatus, request){
    var totalCountPlayers = request.getResponseHeader('x-total'),
        countPages = totalCountPlayers/countPlayers + 1,
        pages = '';
    for (i = 1; i < countPages; i++) {
      pages += '<p class="pagination__item" id="page-' + i + '">' + i +'</p>';
    }
    $('.pagination').html(pages);
    $('#page-1').addClass('pagination__item--active');
  });

  $(document).on('click', '.pagination__item', function(e){
    var pageNumber = $(this).attr('id').substring(5) - 1;
    var startPage = pageNumber*100;
    renderPage(startPage);
    $('.pagination__item').removeClass('pagination__item--active');
    $(this).addClass('pagination__item--active');
  })

  function renderPage(startPage) {
    $.ajax({
      type: "GET",
      url: "http://localhost:20000/api/v1/players?start=" + startPage + "&n=" + countPlayers + "",
      dataType: "json",
      success: render
    })
  }

  function render(data) {
    var row = '';
    for (var i in data) {
      row += '<tr id="player-'+data[i].id+'"><td>'+data[i].id+'</td><td>'+data[i].name+'</td><td>'
      +data[i].level+'</td><td>'+data[i].score+'</td></td></tr>';
    }
    $('#peoplelist').html(row);
    showChiters();
  }

  function showChiters() {
    $.ajax({
      type: "GET",
      url: "http://localhost:20000/api/v1/players/suspects",
      dataType: "json",
      success: function(data){
        var row = '';
        for (var i in data) {
          var $id = $('#player-' + data[i]);
          $id.addClass('chiter');
        }
      }
    });
  }

  $('.filter').on('change', function(){
    var filterBy = $('.filter').val();
    $.ajax({
      type: "GET",
      url: "http://localhost:20000/api/v1/players?level=" + filterBy + "&start=0&n=" + countPlayers + "",
      dataType: "json",
      success: render
    });
  });
});
