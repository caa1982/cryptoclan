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
                    $("#dropDownCoins").val("");
                    $("#asideCoins").append(
                        $(`<img id="${coin}" src=https://files.coinmarketcap.com/static/img/coins/128x128/${coin}.png>`
                        ));
                                    },
                error: function () {
                    console.log("error");
                }
            });

        }
    });
});
