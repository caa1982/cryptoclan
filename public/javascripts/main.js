//drag and drop
$(".sortable").sortable({ revert: true });

$("#dropDownCoins").on("input", function () {
    var coin = $(this).val();
    if ($("#coins option").filter(function () {
        return this.value === coin;
    }).length) {
        $.ajax({
            url: "/send_save",
            type: "POST",
            data: {name: coin}
        });
        $("#asideCoins").append(
            $(`<img src=/images/coins/${coin}.png>`),
        )
    }
});
