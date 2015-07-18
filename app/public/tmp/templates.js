//		 }} Precompiled by Hoganizer {{
//		 }} Compiled templates are at the bottom {{

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);
(function() {var templates = {};
templates.c:\proj\roadshow\app\templates\auction = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b(t.rp("<_header0",c,p,""));t.b("\r");t.b("\n" + i);t.b("<div class=\"row\">\r");t.b("\n" + i);t.b("  <div class=\"large-12 columns\">\r");t.b("\n" + i);t.b("		Auction: ");t.b(t.v(t.f("id",c,p,0)));t.b("\r");t.b("\n" + i);t.b("  </div>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b(t.rp("<_footer1",c,p,""));return t.fl(); },partials: {"<_header0":{name:"_header", partials: {}, subs: {  }},"<_footer1":{name:"_footer", partials: {}, subs: {  }}}, subs: {  }});
templates.c:\proj\roadshow\app\templates\create_auction = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b(t.rp("<_header0",c,p,""));t.b("\r");t.b("\n" + i);t.b("<div class=\"row\">`\r");t.b("\n" + i);t.b("  <div class=\"large-12 columns\">\r");t.b("\n" + i);t.b("    <form action=\"/auction\" method=\"POST\" enctype=\"multipart/form-data\">\r");t.b("\n" + i);t.b("      Take a Photo\r");t.b("\n" + i);t.b("      <input type=\"file\" name=\"item_photo\" accept=\"image/*\" capture=\"camera\">   \r");t.b("\n" + i);t.b("      <img class=\"resize-image\" src=\"images/dragon_egg.jpg\" alt=\"Image\" />\r");t.b("\n" + i);t.b("      Item Name\r");t.b("\n" + i);t.b("      <input type=\"text\" placeholder=\"TV Stand\" required=\"required\" name=\"auction_name\">\r");t.b("\n" + i);t.b("      Starting Bid\r");t.b("\n" + i);t.b("      <div class=\"row collapse\">\r");t.b("\n" + i);t.b("        <div class=\"small-1 columns\">\r");t.b("\n" + i);t.b("          <span class=\"prefix\">$</span>\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("        <div class=\"small-11 columns\">\r");t.b("\n" + i);t.b("          <input type=\"number\" min=\"1\" class=\"medium-11 columns\"  placeholder=\"10\" required=\"required\" name=\"start_bid\">\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("      </div>\r");t.b("\n" + i);t.b("      Increments\r");t.b("\n" + i);t.b("      <div class=\"row collapse\">\r");t.b("\n" + i);t.b("        <div class=\"small-1 columns\">\r");t.b("\n" + i);t.b("          <span class=\"prefix\">$</span>\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("        <div class=\"small-11 columns\">\r");t.b("\n" + i);t.b("          <input type=\"number\" min=\"1\" class=\"medium-11 columns\" required=\"required\" placeholder=\"5\" name=\"step\">\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("      </div>\r");t.b("\n" + i);t.b("      End date <input type=\"date\" name=\"end_date\">\r");t.b("\n" + i);t.b("      <input type=\"submit\" class=\"button postfix\" value=\"Start Auction\">\r");t.b("\n" + i);t.b("    </form>\r");t.b("\n" + i);t.b("  </div>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b(t.rp("<_footer1",c,p,""));return t.fl(); },partials: {"<_header0":{name:"_header", partials: {}, subs: {  }},"<_footer1":{name:"_footer", partials: {}, subs: {  }}}, subs: {  }});
templates.c:\proj\roadshow\app\templates\error = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b(t.rp("<_header0",c,p,""));t.b("\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b("<div class=\"row\">\r");t.b("\n" + i);t.b("  <div class=\"large-12 columns\">\r");t.b("\n" + i);t.b("	Gasp! An error has occured.\r");t.b("\n" + i);t.b("	<br><br>\r");t.b("\n" + i);t.b("	Error Message:");t.b(t.v(t.f("message",c,p,0)));t.b("\r");t.b("\n" + i);t.b("	<br>\r");t.b("\n" + i);t.b("	Error: ");t.b(t.v(t.f("err",c,p,0)));t.b("\r");t.b("\n" + i);t.b("  </div>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b(t.rp("<_footer1",c,p,""));return t.fl(); },partials: {"<_header0":{name:"_header", partials: {}, subs: {  }},"<_footer1":{name:"_footer", partials: {}, subs: {  }}}, subs: {  }});
templates.c:\proj\roadshow\app\templates\index = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b(t.rp("<_header0",c,p,""));t.b("<div class=\"row\">\r");t.b("\n" + i);t.b("  <div class=\"large-12 columns\">\r");t.b("\n" + i);t.b("    <div class=\"row\">\r");t.b("\n" + i);t.b("      <ul class=\"small-block-grid-1 medium-block-grid-2 large-block-grid-3\">\r");t.b("\n" + i);if(t.s(t.f("auctions",c,p,1),c,p,0,190,234,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(t.rp("<_auction_listing1",c,p,"          "));});c.pop();}t.b("      </ul>\r");t.b("\n" + i);t.b("    </div>\r");t.b("\n" + i);t.b("  </div>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b("<div id=\"confirm-bid\" class=\"reveal-modal\" data-reveal aria-labelledby=\"modalTitle\" aria-hidden=\"true\" role=\"dialog\">\r");t.b("\n" + i);t.b("  <h2 id=\"modalTitle\">Bid $30 on Item Name?</h2>\r");t.b("\n" + i);t.b("   <a href=\"#\" class=\"button success\">Confirm</a>\r");t.b("\n" + i);t.b("  <a class=\"close-reveal-modal\" aria-label=\"Close\">&#215;</a>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b(t.rp("<_footer2",c,p,""));return t.fl(); },partials: {"<_header0":{name:"_header", partials: {}, subs: {  }},"<_auction_listing1":{name:"_auction_listing", partials: {}, subs: {  }},"<_footer2":{name:"_footer", partials: {}, subs: {  }}}, subs: {  }});
templates.c:\proj\roadshow\app\templates\isuvak = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<!doctype html>\r");t.b("\n" + i);t.b("<html class=\"no-js\" lang=\"\">\r");t.b("\n" + i);t.b("    <body>\r");t.b("\n" + i);t.b("      <h1>HACK THE WORLD!!!!</h1>\r");t.b("\n" + i);t.b("  </body>\r");t.b("\n" + i);t.b("</html>\r");t.b("\n");return t.fl(); },partials: {}, subs: {  }});
templates.c:\proj\roadshow\app\templates\partials\_auction_listing = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");if(t.s(t.f("doc",c,p,1),c,p,0,8,601,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li>\r");t.b("\n" + i);t.b("  <img src=\"/images/");t.b(t.v(t.f("image_path",c,p,0)));t.b("\">\r");t.b("\n" + i);t.b("  <div class=\"panel\">\r");t.b("\n" + i);t.b("    <div class=\"row collapse\">\r");t.b("\n" + i);t.b("      <div class=\"medium-8 small-12 columns\">\r");t.b("\n" + i);t.b("        <div class=\"row\">\r");t.b("\n" + i);t.b("          <div class=\"medium-12 small-6 columns\">\r");t.b("\n" + i);t.b("            <h5>");t.b(t.v(t.f("auction_name",c,p,0)));t.b("</h5>\r");t.b("\n" + i);t.b("          </div>\r");t.b("\n" + i);t.b("          <div class=\"medium-12 small-6 columns\">\r");t.b("\n" + i);t.b("            $");t.b(t.v(t.f("start_bid",c,p,0)));t.b(" (+$");t.b(t.v(t.f("step",c,p,0)));t.b(")\r");t.b("\n" + i);t.b("          </div>\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("      </div>\r");t.b("\n" + i);t.b("      <div class=\"medium-4 small-12 columns\">\r");t.b("\n" + i);t.b("        <a href=\"#\" class=\"button expand\" data-reveal-id=\"confirm-bid\">Bid</a>\r");t.b("\n" + i);t.b("      </div>\r");t.b("\n" + i);t.b("    </div>\r");t.b("\n" + i);t.b("  </div>\r");t.b("\n" + i);t.b("</li>\r");t.b("\n" + i);});c.pop();}return t.fl(); },partials: {}, subs: {  }});
templates.c:\proj\roadshow\app\templates\partials\_footer = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("      <footer class=\"row margin-bottom\">\r");t.b("\n" + i);t.b("        <div class=\"large-12 columns centered\"><hr/>\r");t.b("\n" + i);t.b("          <a target=\"_top\" href=\"mailto:mbartolome@wayfair.com\">@mbartolome</a>\r");t.b("\n" + i);t.b("          x <a target=\"_top\" href=\"mailto:isuvak@wayfair.com\">@isuvak</a>\r");t.b("\n" + i);t.b("          x <a target=\"_top\" href=\"mailto:ddenchev@wayfair.com\">@ddenchev</a>\r");t.b("\n" + i);t.b("          x <a target=\"_top\" href=\"mailto:mperler@wayfair.com\">@mperler</a>\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("      </footer>\r");t.b("\n" + i);t.b("\r");t.b("\n" + i);t.b("      <!-- build:js scripts/main.js -->\r");t.b("\n" + i);t.b("      <script data-main=\"scripts/main\" src=\"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js\"></script>\r");t.b("\n" + i);t.b("      <script data-main=\"scripts/main\" src=\"//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min.js\"></script>\r");t.b("\n" + i);t.b("      <script data-main=\"scripts/main\" src=\"//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js\"></script>\r");t.b("\n" + i);t.b("      <script data-main=\"scripts/main\" src=\"//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/js/foundation.min.js\"></script>\r");t.b("\n" + i);t.b("      <!-- endbuild -->\r");t.b("\n" + i);t.b("  </body>\r");t.b("\n" + i);t.b("</html>");return t.fl(); },partials: {}, subs: {  }});
templates.c:\proj\roadshow\app\templates\partials\_header = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<!doctype html>\r");t.b("\n" + i);t.b("<html class=\"no-js\" lang=\"\">\r");t.b("\n" + i);t.b("    <head>\r");t.b("\n" + i);t.b("        <meta charset=\"utf-8\">\r");t.b("\n" + i);t.b("        <title>Roadshow</title>\r");t.b("\n" + i);t.b("        <meta name=\"description\" content=\"\">\r");t.b("\n" + i);t.b("        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r");t.b("\n" + i);t.b("        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->\r");t.b("\n" + i);t.b("        <!-- build:css(.tmp) styles/main.css -->\r");t.b("\n" + i);t.b("        <link rel=\"stylesheet\" href=\"/styles/foundation.min.css\">\r");t.b("\n" + i);t.b("        <link rel=\"stylesheet\" href=\"/styles/main.css\">\r");t.b("\n" + i);t.b("        <!-- endbuild -->\r");t.b("\n" + i);t.b("        <!-- build:js scripts/vendor/modernizr.js -->\r");t.b("\n" + i);t.b("        <script src=\"/bower_components/modernizr/modernizr.js\"></script>\r");t.b("\n" + i);t.b("        <!-- endbuild -->\r");t.b("\n" + i);t.b("        <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>\r");t.b("\n" + i);t.b("        <link href='http://fonts.googleapis.com/css?family=Montserrat:700' rel='stylesheet' type='text/css'>\r");t.b("\n" + i);t.b("    </head>\r");t.b("\n" + i);t.b("    <body>\r");t.b("\n" + i);t.b("      <!--[if lt IE 10]>\r");t.b("\n" + i);t.b("          <p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.</p>\r");t.b("\n" + i);t.b("      <![endif]-->\r");t.b("\n" + i);t.b("      <div class=\"row margin-top\">\r");t.b("\n" + i);t.b("        <div class=\"large-12 columns\">\r");t.b("\n" + i);t.b("          <div class=\"row collapse\">\r");t.b("\n" + i);t.b("            <div class=\"medium-3 small-12 columns\">\r");t.b("\n" + i);t.b("              <h3><a href=\"/\">Roadshow/</a></h3>\r");t.b("\n" + i);t.b("            </div>\r");t.b("\n" + i);t.b("            <div class=\"medium-5 small-12 columns\">\r");t.b("\n" + i);t.b("              <input type=\"text\" placeholder=\"e.g. wool socks, phone charger, juicer\">\r");t.b("\n" + i);t.b("            </div>\r");t.b("\n" + i);t.b("            <div class=\"medium-2 small-12 columns\">\r");t.b("\n" + i);t.b("              <a href=\"#\" class=\"button alert postfix\">Search</a>\r");t.b("\n" + i);t.b("            </div>\r");t.b("\n" + i);t.b("            <div class=\"medium-2 small-12 columns\">\r");t.b("\n" + i);t.b("              <a href=\"/auction\" class=\"button success postfix\">+Auction</a>\r");t.b("\n" + i);t.b("            </div>\r");t.b("\n" + i);t.b("          </div>\r");t.b("\n" + i);t.b("        </div>\r");t.b("\n" + i);t.b("      </div>");return t.fl(); },partials: {}, subs: {  }});
window.templates = templates})();