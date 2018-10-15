from django.shortcuts import render, redirect
from homeschool.models import *
from homeschool.forms import *
from posts.forms import *
from comments.forms import *
import random, string
from django.dispatch import receiver
from allauth.account.signals import email_confirmed, user_signed_up
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse
import json
import requests
from django.views.decorators.csrf import csrf_exempt


def randomword(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

class Parser:
    def __init__(self, dico=None):
        self.result = "<ul>"
        self.dictionary = dico
    def parserMethodDictToHTML(self, dictionary=None):
        if dictionary:
            key, value = dictionary.popitem()
            if isinstance(value, type({})):
                self.result+="<li> <strong>{}</strong> : <ul>".format(key)
                self.parserMethodDictToHTML(value)
                self.result+="</ul></li>"
            else:
                self.result+='<li> <strong>{}</strong> : {}</li>'.format(key, value)
                self.parserMethodDictToHTML(dictionary)
            self.parserMethodDictToHTML(dictionary)
    def parseToHTML(self):
        self.parserMethodDictToHTML(self.dictionary)
        self.result+="</ul>"
        return self.result

@receiver(email_confirmed)
def email_confirmed_(request, email_address, **kwargs):
    user = User.objects.get(email=email_address.email)
    user.is_active = True
    user.is_staff = True
    eleve = Eleve()
    eleve.user = user
    eleve.active = False
    eleve.save()
    user.save()

# Create your views here.
def home(request):
    if request.POST:
        queryset_list = Classe.objects.all()
        query = request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(matiere=query)
            ).distinct()
        paginator = Paginator(queryset_list, 8)
        page_request_var = "page"
        page = request.POST.get(page_request_var)
        try:
            queryset = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            queryset = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            queryset = paginator.page(paginator.num_pages)

    return render(request, "home.html")

@login_required(login_url="account_login")
def profile(request):
    if Eleve.objects.filter(user=request.user).exists():
        eleve = Eleve.objects.filter(user=request.user).first()
        mesInscriptions = Inscription.objects.filter(eleve=eleve)
        mesclasses = [inscription.classe for inscription in mesInscriptions]
        mesDevoirs = []
        for classe in mesclasses:
            devoirs = Devoir.objects.filter(classe=classe)
            for devoir in devoirs:
                mesDevoirs.append(devoir)

        content = {
            "eleve": eleve,
            "mesclasses": mesclasses,
            "mesDevoirs": mesDevoirs
        }
        return render(request, "profileEleve.html", content)
    else:
        enseignant = Enseignant.objects.filter(user=request.user).first()
        mesclasses = Classe.objects.filter(enseignant=enseignant)
        nbInscriptions = 0
        mesDevoirs = []
        for classe in mesclasses:
            nbInscriptions = nbInscriptions + DemandeInscription.objects.filter(classe=classe).count()
            devoirs = Devoir.objects.filter(classe=classe)
            for devoir in devoirs:
                mesDevoirs.append(devoir)

        content = {
            "enseignant": enseignant,
            "mesclasses": mesclasses,
            "mesDevoirs": mesDevoirs,
            "nombreInscription": nbInscriptions
        }
        return render(request, "profileEnseignant.html", content)

def list_cours(request):
    classes = Classe.objects.all()
    content = {
        'classes':classes
    }
    return render(request, "cours_list.html", content)

def composerQuizz(request):
    return render(request, "composerQuizz.html", {"form":DevoirForm()})


def login(request):
    return render(request, "login.html")

@login_required(login_url="account_login")
def quizz(request, devoirID=None):
    devoir = Devoir.objects.filter(id=devoirID).first()
    content = {
        "devoir": None
    }
    if devoir:
        nbEssai = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).count()
        form = PostForm(request.POST or None, request.FILES or None)
        if devoir.nombreEssai > nbEssai:
            feuilleEleve = FeuilleEleve.objects.create(devoir=devoir, eleve=request.user)
            if feuilleEleve:
                feuilleEleve.devoir = devoir
                feuilleEleve.eleve = request.user
                reponses = {}
                for question in devoir.quizz.questions.all():
                    propositions = {}
                    propositionsQuestion = None
                    if question.type == "qcr" or question.type == "qr":
                        propositionsQuestion = PropositionRelationnelle.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idPropositionRelationnelle] = {
                                "enonceA":"",
                                "enonceB":""
                            }
                    if question.type == "schema":
                        propositionsQuestion = PropositionSchema.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idPropositionSchema] = {
                                "numero":"",
                                "annotation":""
                            }
                    if question.type == "qcm" or question.type == "ci" or question.type == "qru":
                        propositionsQuestion = Proposition.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idProposition] = False
                    reponses[question.idQuestion] = propositions
                feuilleEleve.reponses = reponses
                feuilleEleve.save()
                content = {
                    "limite":False,
                    "form": form,
                    "devoir":devoir,
                    "idFeuilleEleve": feuilleEleve.id,
                    "question": question,
                    "classe":devoir.classe
                }
        else:
            feuilleEleve = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).first()
            content = {
                "limite":True,
                "form": form,
                "devoir":devoir,
                "idFeuilleEleve": feuilleEleve.id,
                "classe":devoir.classe
            }

    return render(request, "cours/quizz-1.html", content)


@login_required(login_url="account_login")
def quizz_demo(request, devoirID=None):
    devoir = Devoir.objects.filter(id=devoirID).first()
    content = {
        "devoir": None
    }
    if devoir:
        nbEssai = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).count()
        form = PostForm(request.POST or None, request.FILES or None)
        if devoir.nombreEssai > nbEssai:
            feuilleEleve = FeuilleEleve.objects.create(devoir=devoir, eleve=request.user)
            if feuilleEleve:
                feuilleEleve.devoir = devoir
                feuilleEleve.eleve = request.user
                reponses = {}
                for question in devoir.quizz.questions.all():
                    propositions = {}
                    propositionsQuestion = None
                    if question.type == "qcr" or question.type == "qr":
                        propositionsQuestion = PropositionRelationnelle.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idPropositionRelationnelle] = {
                                "enonceA":"",
                                "enonceB":""
                            }
                    if question.type == "schema":
                        propositionsQuestion = PropositionSchema.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idPropositionSchema] = {
                                "numero":"",
                                "annotation":""
                            }
                    if question.type == "qcm" or question.type == "ci" or question.type == "qru":
                        propositionsQuestion = Proposition.objects.filter(question=question)
                        for proposition in propositionsQuestion:
                            propositions[proposition.idProposition] = False
                    reponses[question.idQuestion] = propositions
                feuilleEleve.reponses = reponses
                feuilleEleve.save()
                content = {
                    "limite":False,
                    "form": form,
                    "devoir":devoir,
                    "idFeuilleEleve": feuilleEleve.id,
                    "question": question,
                    "classe":devoir.classe
                }
        else:
            feuilleEleve = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).first()
            content = {
                "limite":True,
                "form": form,
                "devoir":devoir,
                "idFeuilleEleve": feuilleEleve.id,
                "classe":devoir.classe
            }

    return render(request, "cours/quizz-demo.html", content)

@login_required(login_url="account_login")
def course_learn(request, classeID=None):
    classe = Classe.objects.filter(idClass=classeID).first()
    chapitres = ChapitreClasse.objects.filter(classe=classe)
    devoirs = Devoir.objects.filter(classe=classe)
    content = {
        "classe": classe,
        "chapitres": chapitres,
        "devoirs": devoirs,
    }
    return render(request, "cours/course-learn.html", content)

@login_required(login_url="account_login")
def course_learn_enseignant(request, classeID=None):
    classe = Classe.objects.filter(idClass=classeID).first()
    chapitres = ChapitreClasse.objects.filter(classe=classe)
    devoirs = Devoir.objects.filter(classe=classe)
    content = {
        "classe": classe,
        "chapitres": chapitres,
        "devoirs": devoirs,
    }
    return render(request, "cours/course-learn-enseignant.html", content)


@login_required(login_url="account_login")
def quizz_intro(request, devoirID=None):
    devoir = Devoir.objects.filter(id=devoirID).first()
    content = {
        "devoir": None
    }
    if devoir:
        nbEssai = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).count()
        if devoir.nombreEssai > nbEssai:
            content = {
                "status": True,
                "devoir":devoir,
                "classe":devoir.classe,
                "form":None
            }
        else:
            content = {
                "status": False,
                "devoir": devoir,
                "classe": devoir.classe,
                "form": None
            }
    return render(request, "cours/quizz-intro.html", content)


def categories(request):
    classes = Classe.objects.filter(publier=True)
    content = {
        "classes" : classes
    }
    return render(request, "cours/categories.html", content)

@login_required(login_url="account_login")
def assignment_after_submit(request):
    return render(request, "cours/asignment-after-submit.html")

@login_required(login_url="account_login")
def assignment_list(request):
    return render(request, "cours/asignment-list.html")

@login_required(login_url="account_login")
def assignment_marking(request):
    return render(request, "cours/asignment-marking.html")

@login_required(login_url="account_login")
def assignment_received(request):
    return render(request, "cours/asignment-received.html")

@login_required(login_url="account_login")
def assignment_submit(request):
    return render(request, "cours/asignment-submit.html")

@login_required(login_url="account_login")
def create_basic_information(request):
    form = None
    if request.POST:
        form = Basic_Information_Form(request.POST, request.FILES)
        if form.is_valid():
            instance = form.save(commit=False)
            classe = Classe()
            classe.nom = instance.titre
            classe.description = instance.description
            classe.prix = instance.montant
            classe.logo = instance.logo
            classe.matiere = instance.matiere
            classe.dateDebut = instance.dateOuverture
            classe.dateFin = instance.dateFinInscription
            classe.dateFinInscription = instance.dateFinInscription
            classe.enseignant = Enseignant.objects.filter(user=request.user).first()
            classe.groupe = EnseigneA.objects.filter(enseignant=classe.enseignant).first().groupe
            classe.publier = False
            classe.save()
            return redirect('creation-chapitres', classeID=classe.idClass)
    else:
        form = Basic_Information_Form()
    content = {
        "form":form
    }
    return render(request, "cours/create-basic-information.html", content)

@login_required(login_url="account_login")
def creation_chapitres(request, classeID=None):
    form = Creation_Chapitre_Form()
    chapitres = ChapitreClasse.objects.filter(classe__idClass=classeID)
    classe = Classe.objects.filter(idClass=classeID).first()
    content = {
        "form": form,
        "chapitres": chapitres,
        "classeID": classeID,
        "debut": classe.dateDebut,
        "fin": classe.dateFin,
        "titre":Classe.objects.filter(idClass=classeID).first().nom
    }
    return render(request, "cours/creation_chapitres.html", content)

@login_required(login_url="account_login")
def creation_tds(request, classeID=None):
    form = None
    formQuestion = None
    if request.POST:
        form = Creation_TD_Form(classeID, request.POST)
        formQuestion = Creation_Question_Form(classeID, request.POST)
        if form.is_valid():
            instanceTD = form.save(commit=False)
            if len(instanceTD.numeroDesQuestions) != 0:
                devoir = Devoir()
                devoir.chapitre = instanceTD.chapitre
                devoir.consignes = instanceTD.consignes
                numeroDesQuestions = instanceTD.numeroDesQuestions
                listeQuestions = numeroDesQuestions.split(";")
                print(listeQuestions)
                quizz = Quizz()
                quizz.createur = request.user
                quizz.dateCreation = timezone.now()
                quizz.consignes = devoir.consignes
                quizz.intitule = instanceTD.titre
                quizz.save()
                for idQuestion in listeQuestions:
                    if len(idQuestion)>0:
                        question = Question.objects.filter(idQuestion=int(idQuestion)).first()
                        quizz.questions.add(question)
                devoir.numeroDesQuestions = numeroDesQuestions
                devoir.duree = instanceTD.duree
                devoir.nombreEssai = instanceTD.nombre_essai
                devoir.titre = instanceTD.titre
                devoir.quizz = quizz
                devoir.dateDebut = instanceTD.dateDebut
                devoir.dateFin = instanceTD.dateFin
                devoir.classe = Classe.objects.filter(idClass=classeID).first()
                devoir.save()
                content = {
                    "status": True,
                }
            else:
                content = {
                    "status": False,
                    "message": "Vous n'avez pas choisi de questions pour votre devoir"
                }
        else:
            content = {
                "status": False,
                "message": {f: e.get_json_data() for f, e in form.errors.items()}
            }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        form = Creation_TD_Form(classeID)
        formQuestion = Creation_Question_Form(classeID)
        questionForm = QuestionForm(classeID)
    questions = Question.objects.filter(groupe=Classe.objects.filter(idClass=classeID).first().groupe)
    chapitre_selector = ChapitreSelectorForm(classeID)
    devoirs_list = Devoir.objects.filter(classe__idClass=classeID)
    content = {
        "form": form,
        "formQuestion": formQuestion,
        "question":questionForm,
        "classeID": classeID,
        "questions": questions,
        "devoirs_list": devoirs_list,
        "chapitre_selector": chapitre_selector,
        "debut": Classe.objects.filter(idClass=classeID).first().dateDebut,
        "fin": Classe.objects.filter(idClass=classeID).first().dateFin,
        "titre": Classe.objects.filter(idClass=classeID).first().nom,
        "groupeID": Classe.objects.filter(idClass=classeID).first().groupe.idGroupeDeSoutien
    }
    return render(request, "cours/creation_tds.html", content)

@login_required(login_url="account_login")
def creation_examens(request):
    return render(request, "cours/creation_examens.html")

@login_required(login_url="account_login")
def apprendre(request, idChapitre=None):
    chapitre = ChapitreClasse.objects.filter(id=idChapitre).first()
    form = PostForm(request.POST or None, request.FILES or None)
    if request.POST:
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = request.user
            instance.chapitre = chapitre
            instance.save()

    queryset_list = Post.objects.filter(chapitre=chapitre)

    content = {
        "form":form,
        "chapitre":chapitre,
        "classe":chapitre.classe,
        "sujets":queryset_list
    }
    return render(request, "cours/learning.html", content)

@login_required(login_url="account_login")
def apprendre_classe(request, idClass=None):
    chapitre = ChapitreClasse.objects.filter(classe__idClass=idClass).first()
    form = PostForm(request.POST or None, request.FILES or None)
    if request.POST:
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = request.user
            instance.chapitre = chapitre
            instance.save()

    queryset_list = Post.objects.filter(chapitre=chapitre)

    content = {
        "form": form,
        "chapitre": chapitre,
        "classe": chapitre.classe,
        "sujets": queryset_list
    }
    return render(request, "cours/learning.html", content)

@login_required(login_url="account_login")
def account_devoir(request):
    if Eleve.objects.filter(user=request.user).exists():
        eleve = Eleve.objects.filter(user=request.user).first()
        mesInscriptions = Inscription.objects.filter(eleve=eleve)
        mesclasses = [inscription.classe for inscription in mesInscriptions]
        mesDevoirs = []
        for classe in mesclasses:
            devoirs = Devoir.objects.filter(classe=classe)
            mesDevoirs.append({
                "classe": classe,
                "devoirs": [devoir for devoir in devoirs]
            })

        content = {
            "eleve":eleve,
            "mesDevoirs": mesDevoirs
        }
        return render(request, "cours/account-assignment.html", content)
    else:
        return render(request, "home.html")


def enregistrer(request):
    return render(request, "cours/register.html")

@login_required(login_url="account_login")
def account_messagerie(request):
    return render(request, "cours/account-inbox.html")

@login_required(login_url="account_login")
def account_apprentissage(request):
    if Eleve.objects.filter(user=request.user).exists():
        eleve = Eleve.objects.filter(user=request.user).first()
        mesInscriptions = Inscription.objects.filter(eleve=eleve)
        mesclasses = [inscription.classe for inscription in mesInscriptions]
        content = {
            "eleve":eleve,
            "mesclasses": mesclasses
        }
        return render(request, "cours/account-learning.html", content)
    else:
        return render(request, "home.html")


@login_required(login_url="account_login")
def account_profil_invite(request):
    content = None
    if Eleve.objects.filter(user=request.user).exists():
        eleve = Eleve.objects.filter(user=request.user).first()
        isField = True
        for field in eleve._meta.get_fields():
            if field.name not in ["inscription", "choix1", "choix2", "choix3", "situation"]:
                field_value = getattr(eleve, field.name)
                if field_value == None:
                    isField = False
                    print(field.name)
        if isField == True:
            content = {
                "eleve": eleve,
                "isField": isField
            }
        else:
            form = EleveForm(request.POST, instance=eleve)
            if request.POST:
                if form.is_valid():
                    instance = form.save(commit=False)
                    instance.user.first_name = instance.nom
                    instance.user.last_name = instance.prenom
                    instance.save()
                    return redirect('categories')
                else:
                    print(form.errors.as_data())
                    print(form.errors)
            content = {
                "eleve": eleve,
                "form": form,
                "isField": isField
            }
    elif Enseignant.objects.filter(user=request.user).exists():
        enseignant = Enseignant.objects.filter(user=request.user).first()
        isField = True
        for field in enseignant._meta.get_fields():
            if field.name != "classe" and field.name != "enseignea":
                field_value = getattr(enseignant, field.name)
                if field_value == None:
                    isField = False
                    print(field.name)
        if isField == True:
            content = {
                "enseignant": enseignant,
                "isField": isField
            }
        else:
            form = EnseignantForm(request.POST, instance=enseignant)
            if request.POST:
                if form.is_valid():
                    instance = form.save(commit=False)
                    instance.user.first_name = instance.nom
                    instance.user.last_name = instance.prenom
                    instance.save()
                    return redirect('categories')
                else:
                    print(form.errors.as_data())
                    print(form.errors)
            content = {
                "enseignant": enseignant,
                "form": form,
                "isField": isField
            }

    return render(request, "cours/account-profile-guest-view.html", content)

@login_required(login_url="account_login")
def account_profil_titulaire(request):
    return render(request, "cours/account-profile-owner-view.html")

@login_required(login_url="account_login")
def account_enseignement(request):
    mesclasse = Classe.objects.filter(enseignant__user=request.user)
    content = {
        "classes":mesclasse
    }
    return render(request, "cours/account-teaching.html", content)

def pdfViewer(request):
    return render(request, "index.html")

@login_required(login_url="account_login")
def publierCours(request, classeID=None):
    classe = Classe.objects.filter(idClass=classeID).first()
    if request.POST:
        classe.publier = True
        classe.save()
        return redirect("categories")
    nombreChapitres = ChapitreClasse.objects.filter(classe=classe).count()
    nombreTDs = Devoir.objects.filter(classe=classe).count()
    form = ChapitreSelectorForm(classeID)
    content = {
        "classe":classe,
        "nombreChapitres": nombreChapitres,
        "nombreTDs": nombreTDs,
        "form":form
    }
    return render(request, "cours/create-publish-course.html", content)

def cours_intro(request, classeID=None):
    classe = Classe.objects.filter(idClass=classeID).first()
    chapitres = ChapitreClasse.objects.filter(classe=classe)
    devoirs = Devoir.objects.filter(classe=classe)
    content = {
        "classe": classe,
        "chapitres": chapitres,
        "devoirs": devoirs,
    }
    return render(request, "cours/course-intro.html", content)

@login_required(login_url="account_login")
def faireUnDevoir(request, devoirID=None):
    devoir = Devoir.objects.filter(id=devoirID).first()
    content = None
    if devoir:
        feuilleEleve, created = FeuilleEleve.objects.get_or_create(devoir=devoir, eleve=request.user)
        if created:
            feuilleEleve.devoir = devoir
            feuilleEleve.eleve = request.user
            reponses = {}
            for question in devoir.quizz.questions.all():
                propositions = {}
                for proposition in question.propositions.all():
                    propositions[proposition.idProposition] = False
                reponses[question.idQuestion] = propositions
            feuilleEleve.reponses = reponses
            feuilleEleve.save()
        content = {
            "idFeuilleEleve": feuilleEleve.id,
            "idQuizz": devoir.quizz.idQuizz,
        }
    return render(request, "faireUnDevoir.html", content)

@login_required(login_url="account_login")
def afficher_correction_devoir(request, devoirID=None):
    return render(request, "corrige.html", {"devoirID":devoirID})

@login_required(login_url="account_login")
def corriger(request):
    return render(request, "ckeditorTest.html")

@login_required(login_url="account_login")
def demande_inscription(request):
    enseignant = Enseignant.objects.filter(user=request.user).first()
    mesclasses = Classe.objects.filter(enseignant=enseignant)
    eleves = 0
    mesDemandes = []
    for classe in mesclasses:
        demandes = DemandeInscription.objects.filter(classe=classe)
        for demande in demandes:
            eleve = Eleve.objects.filter(user=demande.eleve).first()
            mesDemandes.append(eleve )

    content = {
        "mesDemandes": mesDemandes,
    }
    return render(request, "demandeInscription.html", content)

@csrf_exempt
def callback_wecashup_test(request):
    if request.POST:
        print("CALBACKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        for key, value in request.POST.items():
            print(key, value)

        merchant_uid = 'QwfbFHilryWs2nqv98iXkxhj3dn1'
        merchant_public_key = 'deXvKIHI5f7KhymCMlFNW9WUZUHjrAyuoqd6Uoo9BkYG'
        merchant_secret = 'gt7MJVV1ueNzo1RC'

        transaction_uid = request.POST.get("transaction_uid", None)
        transaction_token = request.POST.get("transaction_token", None)
        transaction_provider_name = request.POST.get("transaction_provider_name", None)
        transaction_confirmation_code = request.POST.get("transaction_confirmation_code", None)

        transaction = Transaction()
        transaction.transaction_confirmation_code = transaction_confirmation_code
        transaction.transaction_uid = transaction_uid
        transaction_provider_name = transaction_provider_name
        transaction.transaction_token = transaction_token
        transaction.save()

        url = 'https://www.wecashup.com/api/v2.0/merchants/' + \
              merchant_uid + \
              '/transactions/' + \
              transaction_uid + \
              '/?merchant_public_key=' + \
              merchant_public_key

        r = requests.post(
            url,
            params={
                'merchant_secret': merchant_secret,
                'transaction_token': transaction_token,
                'transaction_uid': transaction_uid,
                'transaction_confirmation_code': transaction_confirmation_code,
                'transaction_provider_name': transaction_provider_name,
                '_method': "PATCH",
            }
        )

        reponse = r.json()

        if reponse['response_status'] == "success":
            """Do something if success"""
        else:
            """Do something if echec"""
        parseResponse = Parser(reponse)
        content = {
            "reponse": parseResponse.parseToHTML()
        }

        return render(request, "cours/paiement.html", content)
    else:
        content = {
            "status": "GET"
        }
        return redirect('home')


@csrf_exempt
def webhook_wecashup_test(request):
    if request.POST:
        print("WEBHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK")
        for key, value in request.POST.items():
            print(key, value)

        merchant_uid = 'QwfbFHilryWs2nqv98iXkxhj3dn1'
        merchant_public_key = 'deXvKIHI5f7KhymCMlFNW9WUZUHjrAyuoqd6Uoo9BkYG'
        merchant_secret = 'gt7MJVV1ueNzo1RC'
        authenticated = False

        received_transaction_merchant_secret = request.POST.get("merchant_secret", None)
        received_transaction_uid = request.POST.get("transaction_uid", None)
        received_transaction_status = request.POST.get("transaction_status", None)
        received_transaction_details = request.POST.get("transaction_details", None)
        received_transaction_token = request.POST.get("transaction_token", None)
        received_transaction_amount = request.POST.get("transaction_amount", None)
        received_transaction_receiver_currency = request.POST.get("transaction_receiver_currency", None)
        received_transaction_type = request.POST.get("transaction_type", None)

        if received_transaction_status\
                and received_transaction_token\
                and received_transaction_uid\
                and received_transaction_merchant_secret\
                and received_transaction_amount\
                and received_transaction_receiver_currency\
                and received_transaction_details:
            received = Received()
            received.transaction_merchant_secret = received_transaction_merchant_secret
            received.transaction_uid = received_transaction_uid
            received.transaction_token = received_transaction_token
            received.transaction_details = received_transaction_details
            received.transaction_amount = received_transaction_amount
            received.transaction_receiver_currency = received_transaction_receiver_currency
            received.transaction_status = received_transaction_status
            received.transaction_type = received_transaction_type
            received.save()

            if received_transaction_merchant_secret and received_transaction_merchant_secret == merchant_secret:

                transaction = Transaction.objects.filter(
                    transaction_token=received_transaction_token,
                    transaction_uid=received_transaction_uid
                ).first()

                if transaction:
                    if received_transaction_status == "PAID":
                        print("BILL PAID")
                    else:
                        print("BILL NO PAID")
                else:
                    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")

            else:
                print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        else:
            print(received_transaction_token)
            print(received_transaction_uid)
            print(received_transaction_merchant_secret)
            print(received_transaction_amount)
            print(received_transaction_receiver_currency)
            print(received_transaction_details)
    else:
        content = {
            "status": "GET"
        }
        return redirect('home')

