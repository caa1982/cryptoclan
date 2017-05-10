//drag and drop
$(document).ready(function() {
    $(".sortable").sortable({ revert: true });

    $("#dropDownCoins").on("input", function () {
        var coin = $(this).val();
        if ($("#dropDown option").filter(function () {
            return this.value === coin;
        }).length) {
            $.ajax({
                url: "/send_save",
                type: "POST",
                data: { name: coin },
                success: function (response) {
                    console.log("success", response)
                    console.log(coin)
                    $("#dropDownCoins").val("");
                    $("#asideCoins").append(
                        $(`<img src=https://files.coinmarketcap.com/static/img/coins/128x128/${coin}.png>`
                        ));


                },
                error: function () {
                    console.log("error");
                }
            });

        }
    });

})
