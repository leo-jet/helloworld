/**
 * Created by leo on 05/11/17.
 */
CKEDITOR.dialog.add( 'timestampDialog', function( editor ) {
    return {
        title: 'Abbreviation Properties',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'hbox',
                        widths: [ '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%' ],
                        children: [
                            {
                                type: 'button',
                                id: '0',
                                label: '0',
                                title: '0',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '1',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '3',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '4',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '5',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '6',
                                label: '6',
                                title: '6',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '7',
                                label: '7',
                                title: '7',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '8',
                                label: '8',
                                title: '8',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '9',
                                label: '9',
                                title: '9',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: '2',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%' ],
                        children: [
                            {
                                type: 'html',
                                html: '<b>Vorschau</b><div id="math-live-preview">$x=1$</div>',
                                setup: function (element) {
                                    var math= document.getElementById("math-live-preview")
                                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, math])
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%' ],
                        children: [
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%' ],
                        children: [
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%', '20%' ],
                        children: [
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '1',
                                title: '1',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '2',
                                title: '2',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '3',
                                title: '3',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '4',
                                title: '4',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            },
                            {
                                type: 'button',
                                id: 'buttonId',
                                label: '5',
                                title: '5',
                                onClick: function(editor) {
                                    // this = CKEDITOR.ui.dialog.button
                                    CKEDITOR.instances['editor1'].insertText(this.id);
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'tab-adv',
                label: 'Advanced Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'id',
                        label: 'Id'
                    }
                ]
            }
        ],
        onOk: function() {

        }
    };
});