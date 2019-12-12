jQuery.noConflict();
(function($) {
  'use strict';

  // テーブルのカテゴリ別集計（レコード追加・編集画面）
  function inputSubTotal(event) {
    var record = event.record;
    var table = event.record.Table.value;
    var licensePriceTotal = 0;
    var optionPriceTotal = 0;
    table.forEach(function(tableVal) {
      var price = tableVal.value.単価.value;
      var num = tableVal.value.ユーザー数.value;
      if (tableVal.value.カテゴリ.value === 'ライセンス') {
        licensePriceTotal += price * num;
      } else if (tableVal.value.カテゴリ.value === 'オプション') {
        optionPriceTotal += price * num;
      }
    });
    record.ライセンス小計.disabled = true;
    record.オプション小計.disabled = true;
    record.ライセンス小計.value = licensePriceTotal;
    record.オプション小計.value = optionPriceTotal;
    return event;
  }

  kintone.events.on([
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.create.change.カテゴリ',
    'app.record.edit.change.カテゴリ',
    'app.record.create.change.単価',
    'app.record.edit.change.単価',
    'app.record.create.change.ユーザー数',
    'app.record.edit.change.ユーザー数'
  ], inputSubTotal);

  // ポップアップ表示（レコード詳細画面）
  function showToastr(event) {
    var firstMeetDate = moment(event.record.初回商談日.value).format('YYYY-MM-DD');
    var estimateDate = event.record.受注予定日.value;
    var diffDays = moment().diff(firstMeetDate, 'days');
    toastr.options = {
      positionClass: 'toast-bottom-right'
    };
    if (diffDays > 7 && moment().isBefore(estimateDate)) {
      toastr.info('初回商談から' + diffDays + '日経っています。次回 MTG をセッティングしましょう！');
    }
  }

  kintone.events.on('app.record.detail.show', showToastr);

  // 電光掲示板表示（レコード一覧画面）
  function showBoard(event) {
    var headerSpace = kintone.app.getHeaderSpaceElement();
    var $boardDiv = $('<div id="board" class="board"></div>');
    var $boardDivInner = $('<div id="board-inner" class="board-inner"></div>');
    $boardDivInner.html('今月の売上目標は860万円です!達成目指して頑張りましょうo(≧▽≦)o 現在の案件数：' + event.records.length);
    headerSpace.innerHTML = null;
    $boardDiv.append($boardDivInner);
    $(headerSpace).append($boardDiv);
  }

  kintone.events.on('app.record.index.show', showBoard);
})(jQuery);
