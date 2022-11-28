// Interactive JavaScript editor code

let js_interactives = {};

$(document).ready(()=> {
  $(".js_interactive").each((i, el) => {
    const wrapper = $(el);
    const interactive_id = wrapper.attr("id");

    const code_blocks = wrapper.find("pre code");
    const code_ex0 = code_blocks.eq(0); // First code block is the default
    const og_text = code_ex0.text().trim();

    const cm = CodeMirror(wrapper.find(".editor").get(0), {
      mode: 'javascript',
      json: false,
      smartIndent: false,
      gutters: ["CodeMirror-lint-markers"],
      lint: CodeMirror.lint.javascript
    });
    cm.setValue(og_text);
    code_ex0.parent().hide();

    wrapper.find(".reset-button").click((evt) => {
      cm.setValue(og_text);
      wrapper.find(".response").empty();
    });

    wrapper.find(".run-button").click((evt) => {
      // Wipe the results area and make a new response CodeMirror
      const resp = wrapper.find(".response");
      resp.empty().append("<p><strong>Output</strong></p>");
      // TODO: make "Response" translatable
      const cm_resp = CodeMirror(resp.get(0), {
        mode: 'javascript',
        json: false,
        readOnly: true,
        gutters: ["CodeMirror-lint-markers"]
      });

      const oldconsole = console;
      console = {
        log: (...args) => {
          oldconsole.log(...args);
          cm_resp.setValue(args.map(x => JSON.stringify(x, null, 2)).join(" "));
        },
        warn: (...args) => {
          oldconsole.warn(...args);
          cm_resp.setValue(args.map(x => JSON.stringify(x, null, 2)).join(" "));
        },
        error: (...args) => {
          oldconsole.error(...args);
          cm_resp.setValue(args.map((x) => {
            if (x instanceof Error) return x.toString();
            return JSON.stringify(x, null, 2);
          }).join(" "));
        }
      }
      try {
        Function(cm.getValue())();
      } catch(error) {
        console.error(error);
      }

    });

    js_interactives[interactive_id] = {}
    code_blocks.slice(1).each((i, el) => {
      // Turn each additional code block into a function that fills in the
      // editor with the provided text example.
      // Example: js_interactives.some_unique_id.ex_1()
      const code_ex = $(el);
      const ex_text = code_ex.text().trim();
      js_interactives[interactive_id]["ex_"+(i+1)] = function() {
        //
        cm.setValue(ex_text);
        $("html").animate({scrollTop: wrapper.offset().top}, 500);
      }
      code_ex.parent().hide();
    });
  })
});
