// Helper functions for interactive tutorials

function slugify(s) {
  const unacceptable_chars = /[^A-Za-z0-9._ ]+/g
  const whitespace_regex = /\s+/g
  s = s.replace(unacceptable_chars, "")
  s = s.replace(whitespace_regex, "_")
  s = s.toLowerCase()
  if (!s) {
    s = "_"
  }
  return s
}

function complete_step(step_name) {
  const step_id = slugify(step_name)
  $(".bc-"+step_id).removeClass("active").addClass("done")
  $(".bc-"+step_id).next().removeClass("disabled").addClass("active")
}

function pretty_print(j) {
  try {
    return JSON.stringify(JSON.parse(j),null,2)
  } catch (e) {
    // probably already decoded JSON
    return JSON.stringify(j,null,2)
  }

}
