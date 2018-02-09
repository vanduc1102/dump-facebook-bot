$(function () {
  var $searchField = $('#with-ai-search-text');
  var $btnSubmit = $('#btn-submit');
  var $result = $('#result');
  $btnSubmit.on('click', searchWithAi);
  $searchField.on('keypress', function (e) {
    if (e.keyCode === 13) {
      searchWithAi(e);
    }
  });
  function searchWithAi($event) {
    var text = $searchField.val();
    $.get({
      url: '/search-wit-ai?text=' + encodeURIComponent(text)
    })
      .done(function (msg) {
        console.log('asdfasdfasdf');
        $result.html(JSON.stringify(msg, null, '\t'));
      });

  }

  setTimeout(() => {
    $searchField.focus();
  }, 500);
});
