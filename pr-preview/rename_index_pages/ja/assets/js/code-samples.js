$(document).ready(() => {
  $(".single_lang input").change((event) => {
    const lang = $(event.target).val()
    const lang_checked = $(event.target).prop("checked")

    if (lang_checked) {
      // Enabling a language
      //$("#input_all").prop("checked", false)
      $("#code_samples_list .card").hide()
      $(`#code_samples_list .card.lang_${lang}`).show()
    }
    // Disabling a language? Let the other element's handler do it
  })
  $("#input_all").change((event) => {
    const lang = $(event.target).val()
    $("#code_samples_list .card").show()
  })
})
