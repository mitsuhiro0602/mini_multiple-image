$(function() {
    // DataTransferオブジェクトでデータを格納する箱を作る
    var dataBox = new DataTransfer();
    // querySelectorでfile_fieldを取得
    var file_field = document.querySelector('input[type=file]')
    // fileが選択された時に発火するイベント
    var dropArea = document.getElementById("image-box-1");
    // loadイベント発生時に発火するイベント
    window.onload = function(e) {
        // ドラッグした要素がドロップターゲットの上にある時にイベントが発火
        dropArea.addEventListener("dragover", function(e){
            e.preventDefault();
            // ドロップエリアの影がつく
            $(this).children('#image-box__container').css({'border': '1px dashed rgb(204 204 204)', 'box-shadow': '0px 0px 0px'})
        },false);
        // ドラッグした要素をドロップした時に発火するイベント
        dropArea.addEventListener("dropleave", function(e) {
            e.preventDefault();
            // ドロップエリアの影が消える
            $(this).children('#image-box__container').css({'border': '1px dashed rgb(204 204 204)', 'box-shadow': '0px 0px 0px'})
        },false);
        // ドラッグした要素をドロップした時に発火するイベント
        dropArea.addEventListener("drop", function(e) {
            e.preventDefault();
            $(this).children('#image-box__container').css({'border': '1px dashed rgb(204 204 204)', 'box-shadow': '0px 0px 0px'})
            var files = e.dataTransfer.files;
            // ドラッグ&ドロップで取得したデータについて、プレビューを表示
            $.each(files, function(i,file){
                // アップロードされた画像を元に新しくfilereaderオブジェクトを生成
                var fileReader = new FileReader();
                // dataTransferオブジェクトを追加
                dataBox.items.add(file)
                file_field.files = dataBox.files
                // lengthで要素の数を取得
                var num = $('.item-image').length + i + 1
                // 指定されたファイルを読み込む
            fileReader.readAsDataURL(file);
            // 画像が10枚になったら超えたらドロップボックスを削除する
            if  (num == 10){
                $('#image-box__container').css('display', 'none')
            }
            // 読み込み完了すると、srcにfileのURLを格納する
            fileReader.onloadend = function() {
                var src = fileReader.result
                var html = `<div class='item-image' data-image="${file.name}">
                                <div class=' item-image__content'>
                                    <div class='item-image__conent--icon'>
                                        <img src=${src} width="114" height="80" >
                                    </div>
                                </div>
                                <div class='item-image__operetion'>
                                    <div class='item-image__operetion--delete'>削除</div>
                                </div>
                            </div>`
                // image_box_container要素の前にhtmlを差し込む
                $('#image-box__container').before(html);
            };
            // image-box__containerのクラスを変更し、CSSでドロップボックスの大きさを変えてやる。
            $('#image-box__container').attr('class', `item-num-${num}`)
            })
        })
    }
    $('#img-file').change(function(){
        //選択したfileのオブジェクトをpropで取得
        var file = $('input[type="file"]').prop('files')[0];
        //FileReaderのreadAsDataURLで指定したFileオブジェクトを読み込む
        var fileReader = new FileReader();
        //読み込みが完了すると、srcにfileのURLを格納
        fileReader.onloadend = function() {
            var src = fileReader.result
            var html= `<img src="${src}" width="114" height="80">`
            //image_box__container要素の前にhtmlを差し込む
            $('#image-box__container').before(html);
        }
        fileReader.readAsDataURL(file);
    });
    // 削除ボタンをクリックすると発火するイベント
    $(document).on("click", '.item-image__operetion--delete', function(){
        // 削除を押されたプレビューを取得する
        var target_image = $(this).parent().parent()
        // 削除を押されたプレビューimageのfile名を取得する
        var target_name = $(target_image).data('image')
        // プレビューが一つだけの場合、file_fieldをクリア
        if(file_field.files.length==1){
            // inputタグに入ったファイルを削除
            $('input[type=file]').val(null)
            dataBox.clearData();
        }else {
            // プレビューが複数の時
            $.each(file_field.files,function(i,input){
                // 削除を押された要素と一致した時、index番号に基づいてdataBoxに格納された要素を削除する
                if(input.name==target_name){
                    dataBox.items.remove(i)
                }
            })
            // DataTransferオブジェクトに入ったfile一覧をfile_fieldの中に再代入
            file_field.files = dataBox.files
        }
        target_image.remove();
        // image-box__containerクラスを持つdivタグのクラスを削除のたびに変更する
        var num = $('.item-image').length
        $('#image-box__container').show()
        $('#image-box__container').attr('class', `item-num-${num}`)
    })
});