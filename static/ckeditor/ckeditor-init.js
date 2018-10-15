/* global CKEDITOR */
;(function() {
  var el = document.getElementById('ckeditor-init-script');
  if (el && !window.CKEDITOR_BASEPATH) {
    window.CKEDITOR_BASEPATH = el.getAttribute('data-ckeditor-basepath');
  }

  // Polyfill from https://developer.mozilla.org/en/docs/Web/API/Element/matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
  }

  function runInitialisers() {
    initialiseCKEditor();
    initialiseCKEditorInInlinedForms();
  }

  if (document.readyState != 'loading') {
    runInitialisers();
  } else {
    document.addEventListener('DOMContentLoaded', runInitialisers);
  }

  function initialiseCKEditor() {
    var textareas = Array.prototype.slice.call(document.querySelectorAll('textarea[data-type=ckeditortype]'));
    for (var i=0; i<textareas.length; ++i) {
      var t = textareas[i];
      if (t.getAttribute('data-processed') == '0' && t.id.indexOf('__prefix__') == -1) {
        t.setAttribute('data-processed', '1');
        var ext = JSON.parse(t.getAttribute('data-external-plugin-resources'));
        for (var j=0; j<ext.length; ++j) {
          CKEDITOR.plugins.addExternal(ext[j][0], ext[j][1], ext[j][2]);
        }
        CKEDITOR.replace(t.id, JSON.parse(t.getAttribute('data-config')));
      }
    }
  }

  function initialiseCKEditorInInlinedForms() {
    document.body.addEventListener('click', function(e) {
      if (e.target && (
        e.target.matches('.add-row a') ||
        e.target.matches('.grp-add-handler')
      )) {
        initialiseCKEditor();
      }
    });
  }

}());

CKEDITOR.replace( 'content', {
    extraPlugins: 'mathjax',
    mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',
    height: 320
});

if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
    document.getElementById( 'ie8-warning' ).className = 'tip alert';
}
