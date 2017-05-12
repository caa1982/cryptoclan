//drag and drop
$(document).ready(function () {
    $(".sortable").sortable({ revert: true });

    $("#dropDownCoins").on("input", function () {
         console.log("here2")
        var coin = $(this).val();
        if ($("#dropDown option").filter(function () {
            return this.value === coin;
        }).length) {
            console.log("here1")
            $.ajax({
                url: "/send_save",
                type: "POST",
                data: { name: coin },
                success: function (response) {
                    $("#dropDownCoins").val("");
                    console.log("here")
                    $(".coinsDasboard").append(
                        $(`<img id="${coin}" src=https://files.coinmarketcap.com/static/img/coins/128x128/${coin}.png>`
                        ));
                },
                error: function () {
                    console.log("error");
                }
            });

        }
    });

    $('.collapse').collapse('show');
});
