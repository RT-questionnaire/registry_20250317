$(document).ready(function() {
    // フォームに入力があったかどうかのフラグ
    let hasUserInput = false;
    
    // 同意チェックボックスのイベントリスナー
    $('#privacyConsent').on('change', function() {
        if ($(this).is(':checked')) {
            $('#formContent').show();
        } else {
            $('#formContent').hide();
        }
    });
    
    // フォーム入力イベントリスナー
    $('#patientId, #templateId').on('input', function() {
        hasUserInput = true;
    });
    
    // メール送信ボタンのクリックイベント
    $('#sendMailButton').on('click', function() {
        // フォームの値を取得
        let patientId = $('#patientId').val().trim();
        const templateId = $('#templateId').val();
        
        // 入力チェック
        if (!patientId) {
            alert('診察券番号を入力してください。');
            $('#patientId').focus();
            return;
        }
        
        // 診察券番号から冒頭の0や途中のハイフンを削除
        patientId = patientId.replace(/^0+|[-]/g, '');
        
        // メール本文を作成
        const subject = 'メール配信登録';
        const body = 
            '※件名と本文は、特に指示のない限り変更せずに、このまま送信してください。\n\n' + 
            'ユーザーID: ' + patientId + '\n' + 
            'テンプレートID: ' + templateId;
        
        // 送信先メールアドレスを指定
        const emailTo = "rt.questionnaire@gmail.com";
        
        // メールリンクを生成（送信先を指定）
        const mailtoLink = 'mailto:' + encodeURIComponent(emailTo) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        
        // 結果メッセージを表示
        $('#resultMessage').html(
            '<p>ご入力ありがとうございます。以下のボタンからメールを送信してください。</p>'
        );
        
        // メールリンクを表示
        $('#mailContainer').html('<a href="' + mailtoLink + '" class="mail-link">メールを作成する</a>');
        
        // QRコードを生成
        generateQRCode(emailTo, subject, body);
        
        // 登録フォームを非表示にして結果を表示
        $('#registrationForm').hide();
        $('#resultSection').show();
        
        // ページトップにスクロール
        $('html, body').animate({
            scrollTop: 0
        }, 600);
    });
    
    // 戻るボタンのクリックイベント
    $('#backButton').on('click', function() {
        // 結果セクションを隠してフォームを表示
        $('#resultSection').hide();
        $('#registrationForm').show();
        
        // ページトップにスクロール
        $('html, body').animate({
            scrollTop: 0
        }, 600);
    });
    
    // QRコード生成関数
    function generateQRCode(emailTo, subject, body) {
        // 現在のQRコード表示エリアをクリア
        $('#qrcode').empty();
        
        // QRコード用のメールリンクを作成（送信先を指定）
        const mailtoLink = 'mailto:' + encodeURIComponent(emailTo) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        
        // 日本語文字列をUTF-8でエンコード
        let utf8MailtoLink;
        try {
            // Encoding.jsを使用して日本語をUTF-8エンコード
            const unicodeArray = Encoding.stringToCode(mailtoLink);
            const utf8Array = Encoding.convert(unicodeArray, {
                to: 'UTF8',
                from: 'UNICODE'
            });
            utf8MailtoLink = Encoding.codeToString(utf8Array);
        } catch (e) {
            // エンコードに失敗した場合は元のリンクを使用
            console.error('エンコードエラー:', e);
            utf8MailtoLink = mailtoLink;
        }
        
        // QRコード表示エリアを作成
        const qrCodeDiv = $('<div style="text-align: center;"></div>');
        
        // QRコードを生成
        qrCodeDiv.qrcode({
            text: utf8MailtoLink,
            width: 200,
            height: 200,
            correctLevel: 0  // L
        });
        
        // QRコードの説明を追加（コードの下に確実に表示されるように）
        qrCodeDiv.append('<p style="margin-top: 15px;">このQRコードをスキャンすると、メール作成画面が開きます</p>');
        
        // 生成したQRコードをページに追加
        $('#qrcode').append(qrCodeDiv);
    }
}); 

function registerUser(userData) {
  // 既存のコード...
  
  // デバッグ情報を記録
  Logger.log(`registerUser関数を実行します。ユーザーデータ: ${JSON.stringify(userData)}`);
  Logger.log(`スプレッドシートID: ${CONFIG.SPREADSHEET_ID}`);
  Logger.log(`シート名: ${CONFIG.USER_SHEET_NAME}`);
  
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.USER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // ヘッダー行を除外
  const headers = data[0];
  Logger.log(`ヘッダー: ${headers.join(', ')}`);
  
  // 以降も各ステップでログを追加...
} 