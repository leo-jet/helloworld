/**
 * Created by leo on 05/11/17.
 */
CKEDITOR.plugins.add( 'timestamp', {
    icons: 'timestamp',
    init: function( editor ) {
        //Plugin logic goes here.
        editor.addCommand( 'timestamp', new CKEDITOR.dialogCommand( 'timestampDialog' ) );
        editor.ui.addButton( 'Timestamp', {
            label: 'Insert Timestamp',
            command: 'timestamp',
            toolbar: 'insert'
        });
        CKEDITOR.dialog.add( 'timestampDialog', this.path + 'dialogs/timestamp.js' );
    }
});