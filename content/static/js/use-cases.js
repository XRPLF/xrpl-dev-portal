$(document).ready(() => {
    //show these featured on load. 
    const show_cats_arr = ["infrastructure", "developer_tooling"]

    function refreshList() {

        $("#use_case_companies_list .card-uses").hide()

        for (const category of show_cats_arr) {
            $(`#use_case_companies_list .card-uses.category_${category}`).show()  
        } 

        const featured_count = show_cats_arr.filter( (current) => {
            return current == "infrastructure" || current == "developer_tooling"
        })

        const other_count = show_cats_arr.filter( (current) => {
            if ( current !== "infrastructure" && current !== "developer_tooling" ){
                return current
            }
        })

        // update category counts
        if (featured_count.length === 0) {
            $(".featured_count").hide()
        }else {
            $(".featured_count").html(featured_count.length)
            $(".featured_count").show()
        }

        if (other_count.length === 0) {
            $(".other_count").hide()
        }else{
            $(".other_count").html(other_count.length)
            $(".other_count").show()
        }

        if(show_cats_arr.length === 0) {
            $(".total_count").hide()
        }else {
            $(".total_count").html(show_cats_arr.length)
            $(".total_count").show()
        }

    }

  $(".cat_checkbox input").change((event) => {

    const lang = $(event.target).val()
    const lang_checked = $(event.target).prop("checked")
    
    $(".input_"+lang).prop("checked", lang_checked)

    if (lang_checked) {
        if ( show_cats_arr.indexOf(lang) === -1){
            show_cats_arr.push(lang)
        }  
    } else {
        show_cats_arr.indexOf(lang) !== -1 && show_cats_arr.splice(show_cats_arr.indexOf(lang), 1)
    }

    // refresh all visible. 
    refreshList()
  })

    // on first load show the featured cats. 
    refreshList()
})
