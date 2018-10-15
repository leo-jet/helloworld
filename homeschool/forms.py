#!/usr/bin/python2.7
# coding: utf-8

from django.forms import ModelForm, ValidationError
from .models import *
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Button, Submit, Div, HTML, Reset, Fieldset
from crispy_forms.bootstrap import FormActions
from django import forms
from ckeditor.fields import RichTextFormField


class DevoirForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(DevoirForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        # NEW:
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-10'

        self.helper.layout = Layout(
            Div('periode', ),
            Div('duree', ),
            Div('nombreEssai'),
            Div('classe', ),
            Div('idsQuestions', ),
        )

    class Meta:
        model = ModelDevoirForm
        fields = '__all__'

class QuestionForm(ModelForm):
    def __init__(self, classeID, *args, **kwargs):
        super(QuestionForm, self).__init__(*args, **kwargs)
        self.fields['chapitre'].queryset = ChapitreClasse.objects.filter(classe__idClass=classeID)
        self.helper = FormHelper(self)
        self.helper.attrs = {'class':'form-horizontal'}
        self.helper.form_tag = False
        self.helper.disable_csrf = True

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            Div(
                                HTML("""Enonce"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "enonce",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Explications"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "explication",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Type"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "type",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Chapitre"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "chapitre",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Concours (optionnel) """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "concours",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Session"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "session",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Partie"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "partie",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""Numero"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "numero",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Submit("submit", "Enrégistrer", css_class="btn btn-primary"),
                            Reset("annuler", "Annuler", css_class="btn btn-info")
                            ,css_class="form-group"
                        )
                    )
                    ,css_class="col-md-10 col-md-offset-1"
                )
            ),
        )

    class Meta:
        model = Question
        fields = [
            "enonce",
            "explication",
            "type",
            "chapitre",
            "session",
            "numero",
            "partie",
            "concours",
        ]
        labels = {
            "enonce":'',
            "explication":'',
            "type":'',
            "chapitre":'',
            "session":'',
            "numero":'',
            "partie":'',
            "concours":'',
        }
        widgets = {
            "chapitre": forms.Select(attrs={"id": "chapitre_selector"})
        }

class PropositionForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(PropositionForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper._form_method = "POST"
        self.helper.form_tag = False
        self.helper.disable_csrf = True

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            "question",
                        ),
                        Div(
                            Div(
                                HTML("""Enoncé"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "enonce",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Div(
                                HTML("""Solution"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                HTML("""<div class="checkbox checkbox-primary">
                                            <input id="solution_id" name="solution" type="checkbox">
                                            <label for="solution_id">
                                                ""
                                            </label>
                                        </div>""")
                                ,css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Submit("submit", "Enrégistrer", css_class="btn btn-primary"),
                            Button("terminer", "Terminer", css_class="btn btn-warning"),
                            Reset("reset", "Annuler", css_class="btn btn-info")
                            ,css_class="form-group"
                        )
                    )
                    ,css_class="col-md-10 col-md-offset-1"
                )
            ),
        )
    class Meta:
        model = Proposition
        fields = [
            "enonce",
            "question",
        ]
        labels = {
            "enonce":'',
            "question":'',
        }
        widgets = {
            "question": forms.HiddenInput()
        }

class PropositionRelationnelleForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(PropositionRelationnelleForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper._form_method = "POST"
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        # NEW:
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-10'

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            "question",
                            css_class="hidden"
                        ),
                        Div(
                            Div(
                                HTML("""Proposition : """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "enonceA",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Div(
                                HTML("""Proposition complémentaire : """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "enonceB",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Submit("submit", "Enrégistrer", css_class="btn btn-primary"),
                            Button("terminer", "Terminer", css_class="btn btn-warning"),
                            Reset("reset", "Annuler", css_class="btn btn-info")
                            , css_class="form-group"
                        )
                    )
                    , css_class="col-md-10 col-md-offset-1"
                )
            ),
        )

    def clean(self):
        cleaned_data = super().clean()
        enonceA = cleaned_data.get("enonceA")
        enonceB = cleaned_data.get("enonceB")
        question = cleaned_data.get("question")

        if PropositionRelationnelle.objects.filter(enonceA=enonceA, question=question):
            msg = "Cette proposition existe déjà pour cette question."
            self.add_error('enonceA', msg)

        if PropositionRelationnelle.objects.filter(enonceB=enonceB, question=question):
            msg = "Cette proposition existe déjà pour cette question."
            self.add_error('enonceB', msg)

    class Meta:
        model = PropositionRelationnelle
        fields = [
            "enonceA",
            "enonceB",
            "question"
        ]
        labels = {
            "enonceA":"",
            "enonceB":"",
            "question":"",
        }

class PropositionReponseOuverteCourteForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(PropositionReponseOuverteCourteForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper._form_method = "POST"
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        # NEW:
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-10'

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            "question",
                            css_class="hidden"
                        ),
                        Div(
                            Div(
                                HTML("""Réponse : """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "enonce",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Submit("submit", "Enrégistrer", css_class="btn btn-primary"),
                            Button("terminer", "Terminer", css_class="btn btn-warning"),
                            Reset("submit", "Terminer", css_class="btn btn-info")
                            , css_class="form-group"
                        )
                    )
                    , css_class="col-md-10 col-md-offset-1"
                )
            ),
        )
    class Meta:
        model = PropositionReponseOuverteCourte
        fields = [
            "enonce",
            "question"
        ]
        labels = {
            "enonce":"",
            "question":"",
        }

class PropositionSchemaForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(PropositionSchemaForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper._form_method = "POST"
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        # NEW:
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-10'

        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            "question",
                            css_class="hidden"
                        ),
                        Div(
                            Div(
                                HTML("""Annotation : """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "annotation",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Div(
                                HTML("""Numéro : """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "numero",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            Submit("submit", "Enrégistrer", css_class="btn btn-primary"),
                            Button("terminer", "Terminer", css_class="btn btn-warning"),
                            Reset("reset", "Annuler", css_class="btn btn-info")
                            , css_class="form-group"
                        )
                    )
                    , css_class="col-md-10 col-md-offset-1"
                )
            ),
        )
    class Meta:
        model = PropositionSchema
        fields = [
            "numero",
            "annotation",
            "question"
        ]
        labels = {
            "numero":'',
            "annotation":'',
            "question":'',
        }



class CkEditorForm(forms.Form):
    content = RichTextFormField()

class Basic_Information_Form(ModelForm):
    def __init__(self, *args, **kwargs):
        super(Basic_Information_Form, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                "descriptionHidden",
                css_class="hidden"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Titre</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'titre'
                            ,
                            HTML("""<span class="message-erreur" name='titre' hidden>Le titre doit contenir entre 10 et 50 caractères ! </span>"""),
                            HTML("""<span class="message-erreur" name='titreVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "tag-item create-item"
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4>Matière</h4>"""),
                        css_class = "col-md-3"
                    ),
                    Div(
                        Div(
                            'matiere'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "tag-item create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Logo du cours</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'logo'
                            ,
                            HTML("""<span class="message-erreur" name='logoVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Description</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'description'
                            ,
                            HTML("""<span class="message-erreur" name='descriptionVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Date d'ouverture</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'dateOuverture'
                            ,
                            HTML("""<span class="message-erreur" name='dateOuvertureVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="input-group date")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4>Fin des cours</h4>"""),
                        css_class = "col-md-3"
                    ),
                    Div(
                        Div(
                            'dateFinCours'
                            ,
                            HTML("""<span class="message-erreur" name='dateFin' hidden>La date de fin est inférieur à la date de début ! </span>"""),
                            HTML("""<span class="message-erreur" name='dateFinVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="input-group date")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Fin des inscription</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'dateFinInscription'
                            ,
                            HTML("""<span class="message-erreur" name='dateFinInscription' hidden>La date de fin d'inscription doit être
                            inférieur à la date de fin du cours et supérieure à la de début du cours! </span>"""),
                            HTML("""<span class="message-erreur" name='dateFinInscriptionVide' hidden>Ce champs est obligatoire ! </span>"""),
                            css_class="input-group date")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4>Montant</h4>"""),
                        css_class = "col-md-3"
                    ),
                    Div(
                        Div(
                            "montant",
                            HTML("""<span class="message-erreur" name='montant' hidden>Le prix du cours doit être supérieur ou égale à 0. </span>"""),
                            css_class="input-group")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "tuition-fee create-item"
            )
        )

    class Meta:
        model = Basic_Information
        fields = '__all__'
        labels = {
            'logo': '',
            'description': '',
            'titre': '',
            'dateOuverture': '',
            'dateFinInscription': '',
            'descriptionHidden':'',
            'dateFinCours': '',
            'montant': '',
            'matiere': '',
        }
        widgets = {
            'titre': forms.TextInput(attrs={'placeholder': 'Titre du cours', 'minlength': 10, 'maxlength': 50 }),
            'montant': forms.NumberInput(attrs={'placeholder': 'FCFA'}),
            'dateOuverture': forms.DateInput(attrs={'value': '31-12-1999', 'type': 'date'}),
            'dateFinInscription': forms.DateInput(attrs={'value': '31-12-1999', 'type': 'date'}),
            'dateFinCours': forms.DateInput(attrs={'value': '31-12-1999', 'type': 'date'}),
        }

class Creation_Chapitre_Form(ModelForm):
    def __init__(self, *args, **kwargs):
        super(Creation_Chapitre_Form, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div(
                            Div(
                                HTML("""<strong>Titre</strong>"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "titre",
                                HTML("""<span class="message-erreur" name='titre' hidden>Le titre doit contenir entre 10 et 50 caractères ! </span>"""),
                                HTML("""<span class="message-erreur" name='titreVide' hidden>Ce champs est obligatoire ! </span>"""),

                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""<strong>Description</strong> """),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "description",
                                HTML(
                                    """<span class="message-erreur" name='descriptionVide' hidden>Ce champs est obligatoire ! </span>"""),

                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""<strong>Date de début</strong>"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "dateDebut",
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""<strong>Date de fin</strong>"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "dateFin",
                                HTML(
                                    """<span class="message-erreur" name='dateFin' hidden>La date de fin est inférieur à la date de début ! </span>"""),
                                HTML(
                                    """<span class="message-erreur" name='dateFinVide' hidden>Ce champs est obligatoire ! </span>"""),
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""<strong>Numero </strong>"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "numero",
                                HTML(
                                    """<span class="message-erreur" name='numero' hidden>Ce numéro de chapitre existe déjà !
                                    Si vous continuez vous allez modifier ce chapitre</span>"""),
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                        Div(
                            Div(
                                HTML("""<strong>Contenu</strong>"""),
                                css_class="col-md-3 control-label"
                            ),
                            Div(
                                "contenu",
                                HTML(
                                    """<span class="message-erreur" name='contenuVide' hidden>Ce champs est obligatoire ! </span>"""),
                                css_class="col-md-9"
                            ),
                            css_class="form-group"
                        ),
                        Div(
                            HTML("""<hr/>""")
                        ),
                    )
                    , css_class="col-md-10 col-md-offset-1"
                )
            ),
        )

    class Meta:
        model = Creation_Chapitre
        fields = '__all__'
        labels = {
            'titre': '',
            'contenu1': '',
            'contenu': '',
            'contenu2': '',
            'numero': '',
            'description': '',
            'dateDebut': '',
            'dateFin': '',
        }
        widgets = {
            'titre': forms.TextInput(attrs={'placeholder': 'Titre du cours'}),
            'montant': forms.NumberInput(attrs={'placeholder': 'FCFA'}),
            'dateDebut': forms.TextInput(attrs={'type': 'date'}),
            'dateFin': forms.TextInput(attrs={'type': 'date'}),
        }
class Creation_TD_Form(ModelForm):
    def __init__(self, classeID, *args, **kwargs):
        super(Creation_TD_Form, self).__init__(*args, **kwargs)
        self.fields['chapitre'].queryset = ChapitreClasse.objects.filter(classe__idClass=classeID)
        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        self.helper.layout = Layout(
            Div(
                Div(
                    Div( HTML("""<h4>Titre</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'titre'
                            ,
                            HTML("""<span class="message-error" name="titreVide" hidden>Ce champs est obligatoire !</span>"""),
                            HTML("""<span class="message-error" name="titreTaille" hidden>Le titre doit contenir entre 10 et 50 caractères !</span>"""),
                            HTML("""<span class="message-error" name="titreExiste" hidden>Ce titre existe déjà !</span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "tag-item create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Date de début</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'dateDebut'
                            ,
                            HTML("""<span class="message-error" name="dateDebutVide" hidden>Ce champs est obligatoire !</span>"""),
                            css_class="input-group date")
                        ,
                        css_class = "col-md-4"
                    ),
                    Div( HTML("""<h4>Date de fin</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'dateFin'
                            ,
                            HTML("""<span class="message-error" name="dateFinVide" hidden>Ce champs est obligatoire !</span>"""),
                            HTML("""<span class="message-error" name="dateFin" hidden>La date de début doit être inférieure à la date de fin !</span>"""),
                            css_class="input-group date")
                        ,
                        css_class = "col-md-4"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div(
                        HTML("""<div class="form-item form-checkbox checkbox-style">
                                                        <input type="checkbox" id="limittime" name="limittime">
                                                        <label for="limittime">
                                                            <i class="icon-checkbox icon md-check-1"></i>
                                                            Durée limitée
                                                        </label>
                                                    </div>""")
                        ,
                        css_class = "col-md-4"
                    ),
                    Div(
                        HTML("""<div class="form-item form-checkbox checkbox-style">
                                                        <input type="checkbox" id="showanswer" name="showanswer">
                                                        <label for="showanswer">
                                                            <i class="icon-checkbox icon md-check-1"></i>
                                                            Montrer la réponse
                                                        </label>
                                                    </div>"""),
                        css_class = "col-md-4"
                    ),
                    css_class = "row"
                ),
                css_class= "tuition-fee create-item"
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4>Durée</h4>"""),
                        css_class = "col-md-2"
                    ),
                    Div(
                        Div(
                            "duree",
                            css_class="input-group")
                        ,
                        css_class = "col-md-4"
                    ),
                    Div(
                        HTML("""<h4>Nombre d'essais</h4>"""),
                        css_class = "col-md-3"
                    ),
                    Div(
                        Div(
                            "nombre_essai",
                            css_class="input-group")
                        ,
                        css_class = "col-md-3"
                    ),
                    css_class = "row"
                ),
                css_class= "tuition-fee create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Chapitres</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'chapitre'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Consignes</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'consignes'
                            ,
                            HTML("""<span class="message-error" name="consignesVide" hidden>Ce champs est obligatoire !</span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "course-banner create-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Numeros des questions</h4>"""),
                         css_class = "col-md-3"
                         ),
                    Div(
                        Div(
                            'numeroDesQuestions',
                            HTML("""<span class="message-error" name="numeroDesQuestionsVide" hidden>Ce champs est obligatoire !</span>"""),
                            HTML("""<span class="message-error" name="numeroDesQuestionsExiste" hidden>Un devoir avec les mêmes questions existe déjà ! </span>"""),
                            css_class="")
                        ,
                        css_class = "col-md-9"
                    ),
                    css_class = "row"
                ),
                css_class= "tag-item create-item"
            )
        )

    class Meta:
        model = Creation_TD
        fields = '__all__'
        labels = {
            'consignes': '',
            'numeroDesQuestions': '',
            'chapitre': '',
            'duree': '',
            'nombre_essai': '',
            'titre': '',
            'dateDebut': '',
            'dateFin': '',
        }
        widgets = {
            "dateDebut": forms.TextInput(attrs={"type":"date"}),
            "dateFin": forms.TextInput(attrs={"type":"date"}),
            "duree": forms.TextInput(attrs={"type":"time"}),
            "titre": forms.TextInput(attrs={"placeholder":"Titre du TD"}),
            "numeroDesQuestions": forms.Textarea(attrs={"placeholder":"exemple de format : 12;14;20;15"}),
        }

class Creation_Question_Form(ModelForm):
    def __init__(self, classeID, *args, **kwargs):
        super(Creation_Question_Form, self).__init__(*args, **kwargs)
        self.fields['chapitre'].queryset = ChapitreClasse.objects.filter(classe__idClass=classeID)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper.form_id = 'new_question'
        self.helper.layout = Layout(
            Div(
                "reponseProposition1",
                css_class="hidden"
            ),
            Div(
                "reponseProposition2",
                css_class="hidden"
            ),
            Div(
                "reponseProposition3",
                css_class="hidden"
            ),
            Div(
                "reponseProposition4",
                css_class="hidden"
            ),
            Div(
                "reponseProposition5",
                css_class="hidden"
            ),
            Div(
                "reponseProposition6",
                css_class="hidden"
            ),
            Div(
                "reponseProposition7",
                css_class="hidden"
            ),
            Div(
                "reponseProposition8",
                css_class="hidden"
            ),
            Div(
                "reponseProposition9",
                css_class="hidden"
            ),
            Div(
                "reponseProposition10",
                css_class="hidden"
            ),
            Div(
                "enonceProposition1Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition2Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition3Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition4Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition5Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition6Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition7Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition8Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition9Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceProposition10Hidden",
                css_class="hidden"
            ),
            Div(
                "enonceHidden",
                css_class="hidden"
            ),
            Div(
                "explicationHidden",
                css_class="hidden"
            ),
            Div(
                Div(
                    Div(
                        Div( HTML("""<h4>Chapitre</h4>"""),
                             css_class = "col-md-2"
                             ),
                        Div(
                            Div(
                                'chapitre'
                                ,
                                css_class="")
                            ,
                            css_class = "col-md-10"
                        ),
                        css_class = "row"
                    ),
                ),
                css_class="form-item"
            ),
            Div(
                Div(
                    Div(
                        Div( HTML("""<h4>Type de question</h4>"""),
                             css_class = "col-md-3"
                             ),
                        Div(
                            Div(
                                'type'
                                ,
                                css_class="")
                            ,
                            css_class = "col-md-9"
                        ),
                        css_class = "row"
                    ),
                ),
                css_class="form-item"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonce'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Explication</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'explication'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Concours (Optionnel)</h4>"""),
                         css_class = "col-md-4"
                         ),
                    Div(
                        Div(
                            'concours'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-8"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Session (Optionnel)</h4>"""),
                         css_class = "col-md-4"
                         ),
                    Div(
                        Div(
                            'session'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-8"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Partie (Optionnel)</h4>"""),
                         css_class = "col-md-4"
                         ),
                    Div(
                        Div(
                            'partie'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-8"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Numero (Optionnel)</h4>"""),
                         css_class = "col-md-4"
                         ),
                    Div(
                        Div(
                            'numero'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-8"
                    ),
                    css_class = "row"
                ),
            ),
            Div(
                HTML("""<div class="total-quest">
                                    <div class="new-question">
                                        <a class="mc-btn-3 btn-style-7" id="nouvelle_proposition_bouton">
                                            <i class="icon md-plus"></i>Nouvelle proposition
                                        </a>
                                    </div>
                                </div>"""),
                css_class="row"
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition1'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition1"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition1">
                            <label for="reponseProposition1">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition1"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition2'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition2"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition2">
                            <label for="reponseProposition2">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition2"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition3'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition3"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition3">
                            <label for="reponseProposition3">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition3"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition4'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition4"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition4">
                            <label for="reponseProposition4">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition4"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition5'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition5"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition5">
                            <label for="reponseProposition5">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition5"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition6'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition6"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition6">
                            <label for="reponseProposition6">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition6"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition7'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition7"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition7">
                            <label for="reponseProposition7">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition7"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition8'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition8"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition8">
                            <label for="reponseProposition8">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition8"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition9'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition9"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition9">
                            <label for="reponseProposition9">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition9"
                ),
            ),
            Div(
                Div(
                    Div( HTML("""<h4>Enoncé</h4>"""),
                         css_class = "col-md-2"
                         ),
                    Div(
                        Div(
                            'enonceProposition10'
                            ,
                            css_class="")
                        ,
                        css_class = "col-md-10"
                    ),
                    css_class = "row",
                    name ="proposition10"
                ),
            ),
            Div(
                Div(
                    Div(
                        HTML("""<h4><div class="form-item form-checkbox checkbox-style">
                            <input type="checkbox" name="solution" id="reponseProposition10">
                            <label for="reponseProposition10">
                                <i class="icon-checkbox icon md-check-1"></i>
                                Solution
                            </label>
                        </div>"""),
                        css_class="col-md-12"
                    ),
                    css_class = "row",
                    name ="proposition10"
                ),
            ),
            Div(
                HTML("""<input type="submit" id="ajouter_proposition_bouton" value="Ajouter la proposition" onclick="ajouterProposition();" class="submit mc-btn-3 btn-style-1" hidden>"""),
                css_class="form-action",
                name="cadre_ajouter_proposition_bouton"
            ),
            Div(
                HTML("""<div class="dc-assignment-info dc-course-item" id="propositions_liste">
                                                <div class="dc-content-title">
                                                    <h5 class="xsm black">Propositions</h5>
                                                </div>

                                                <div name="" class="assignment-body dc-item-body" id="proposition_div">
                                                    <div class="content-item-info">
                                                        <div id="enonce_clone">
                                                        </div>
                                                        <div class="upload-cnt">
                                                            <div class="upload-footer">
                                                                <a></a>
                                                                <a name="supprimer_proposition" position="">Supprimer</a>
                                                                <a>Modifier</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>"""),
                css_class="row"
            ),
            Div(
                HTML("""<input type="submit" value="Ajouter la question" onclick="ajouterQuestion()" class="submit mc-btn-3 btn-style-1">"""),
                css_class="form-action"
            )
        )

    class Meta:
        model = Creation_Question
        fields = '__all__'
        labels = {
            'enonce': '',
            'enonceHidden': '',
            'enonceProposition1': '',
            'enonceProposition2': '',
            'enonceProposition3': '',
            'enonceProposition4': '',
            'enonceProposition5': '',
            'enonceProposition6': '',
            'enonceProposition7': '',
            'enonceProposition8': '',
            'enonceProposition9': '',
            'enonceProposition10': '',
            'enonceProposition1Hidden': '',
            'enonceProposition2Hidden': '',
            'enonceProposition3Hidden': '',
            'enonceProposition4Hidden': '',
            'enonceProposition5Hidden': '',
            'enonceProposition6Hidden': '',
            'enonceProposition7Hidden': '',
            'enonceProposition8Hidden': '',
            'enonceProposition9Hidden': '',
            'enonceProposition10Hidden': '',
            'explication': '',
            'explicationHidden': '',
            'chapitre': '',
            'qcm': '',
            'type': '',
            'session': '',
            'publier': '',
            'numero': '',
            'partie': '',
            'concours': '',
        }

class ChapitreSelectorForm(ModelForm):
    def __init__(self, classeID, *args, **kwargs):
        super(ChapitreSelectorForm, self).__init__(*args, **kwargs)
        self.fields['chapitre'].queryset = ChapitreClasse.objects.filter(classe__idClass=classeID)
        self.helper = FormHelper(self)
        self.helper.form_class = 'form-horizontal'
        self.helper.form_id = 'select_chapitre'
        self.helper.layout = Layout(
            Div(
                Div(
                    Div(
                        Div( HTML("""<h4>Chapitre</h4>"""),
                             css_class = "col-md-2"
                             ),
                        Div(
                            Div(
                                'chapitre'
                                ,
                                css_class="")
                            ,
                            css_class = "col-md-10"
                        ),
                        css_class = "row"
                    ),
                ),
                css_class="form-item"
            )
        )

    class Meta:
        model = ChapitreSelector
        fields = '__all__'
        labels = {
            "chapitre":''
        }
        widgets = {
            "chapitre": forms.Select(attrs={"id": "chapitre_selector"})
        }


class SignUpForm(forms.ModelForm):

    class Meta:
        model = SignUp
        fields = "__all__"


class EleveForm(ModelForm):

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        super(EleveForm, self).__init__(*args, **kwargs)
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Div(
                Div(
                    HTML("""<strong>Nom : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "nom",
                    HTML("""<span class="message-error" name="nom" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Prénom : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "prenom",
                    HTML("""<span class="message-error" name="prenom" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Date de naissance : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "dateNaissance",
                    HTML("""<span class="message-error" name="dateNaissance" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Lieu de naissance : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "lieuNaissance",
                    HTML("""<span class="message-error" name="lieuNaissance" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Sexe : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "sexe",
                    HTML("""<span class="message-error" name="sexe" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Numéo de téléphone : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "telephone",
                    HTML("""<span class="message-error" name="telephone" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Niveau d'étude : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "niveau",
                    HTML("""<span class="message-error" name="niveau" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Etablissement fréquenté : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "etablissement",
                    HTML("""<span class="message-error" name="etablissement" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Quartier de l'établissement : </strong>""")
                    ,css_class="col-md-4"
                ),
                Div(
                    "lieuEtablissement",
                    HTML("""<span class="message-error" name="lieuEtablissement" hidden>Ce champs est obligatoire !</span>""")
                    ,css_class="col-md-7"
                )
                ,css_class="row"
            ),
            Fieldset(
                "Souhait de formation post bac",
                Div(
                    Div(
                        HTML("""<strong>Souhait 1 : </strong>""")
                        ,css_class="col-md-4"
                    ),
                    Div(
                        "choix1",
                    HTML("""<span class="message-error" name="choix1" hidden>Ce champs est obligatoire !</span>""")
                        ,css_class="col-md-7"
                    )
                    ,css_class="row"
                ),
                Div(
                    Div(
                        HTML("""<strong>Souhait 2 : </strong>""")
                        ,css_class="col-md-4"
                    ),
                    Div(
                        "choix2",
                    HTML("""<span class="message-error" name="choix2" hidden>Ce champs est obligatoire !</span>""")
                        ,css_class="col-md-7"
                    )
                    ,css_class="row"
                ),
                Div(
                    Div(
                        HTML("""<strong>Souhait 3 : </strong>""")
                        ,css_class="col-md-4"
                    ),
                    Div(
                        "choix3",
                    HTML("""<span class="message-error" name="choix3" hidden>Ce champs est obligatoire !</span>""")
                        ,css_class="col-md-7"
                    )
                    ,css_class="row"
                ),
                css_class="hidden",
                css_id="choix"
            )
        )
        for field in self.fields:
            self.fields[field].label = ""

    class Meta:
        model = Eleve
        fields = (
            'nom', 'prenom', 'dateNaissance', 'lieuNaissance', 'telephone',
            'sexe', 'etablissement', 'lieuEtablissement', 'choix1', 'choix2',
            'choix3', 'niveau'
        )
        widgets = {
            "nom": forms.TextInput(attrs={"ng-model": "nom"}),
            "prenom": forms.TextInput(attrs={"ng-model": "prenom"}),
            "dateNaissance": forms.TextInput(attrs={"ng-model": "dateNaissance", "type": "Date"}),
            "lieuNaissance": forms.TextInput(attrs={"ng-model": "lieuNaissance"}),
            "telephone": forms.TextInput(attrs={"ng-model": "telephone", "class": "bfh-phone", "data-format":"+237ddddddddd"}),
            "sexe": forms.Select(attrs={"ng-model": "sexe", "required":"false"}),
            "etablissement": forms.TextInput(attrs={"ng-model": "etablissement"}),
            "lieuEtablissement": forms.TextInput(attrs={"ng-model": "lieuEtablissement"}),
            "choix1": forms.Select(attrs={"ng-model": "choix1"}),
            "choix2": forms.Select(attrs={"ng-model": "choix2"}),
            "choix3": forms.Select(attrs={"ng-model": "choix3"}),
            "niveau": forms.Select(attrs={"ng-model": "niveau", "ng-click":"clickNiveau()"}),
        }

class EnseignantForm(ModelForm):

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        super(EnseignantForm, self).__init__(*args, **kwargs)
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        self.helper.layout = Layout(
            Div(
                Div(
                    HTML("""<strong>Nom : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "nom"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Prénom : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "prenom"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Date de naissance : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "dateNaissance"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Lieu de naissance : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "lieuNaissance"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Sexe : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "sexe"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Numéro de téléphone : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "telephone"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Div(
                    HTML("""<strong>Spécialité : </strong>""")
                    ,css_class="col-md-6"
                ),
                Div(
                    "specialite"
                    ,css_class="col-md-6"
                )
                ,css_class="row"
            ),
            Div(
                Submit('submit', 'Envoyer')
            )
        )
        self.fields['nom'].required = True
        self.fields['prenom'].required = True
        self.fields['dateNaissance'].required = True
        self.fields['lieuNaissance'].required = True
        self.fields['telephone'].required = True
        for field in self.fields:
            self.fields[field].label = ""

    class Meta:
        model = Enseignant
        fields = (
            'nom', 'prenom', 'dateNaissance', 'lieuNaissance', 'telephone',
            'sexe', 'specialite'
        )