
import json
import requests
from datetime import datetime,date
from comments.forms import *
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, Http404
from django.template.loader import render_to_string
from django.template.response import TemplateResponse
from comments.models import *
from homeschool.forms import *
from django.db.models import Q
from posts.models import *
from .serializers import *


def get_chapitres_by_matiere(request):
    if request.method == "GET":
        enseignant= Enseignant.objects.filter(user=request.user).first()
        chapitres = None
        if enseignant:
            chapitres = Chapitre.objects.filter(matiere=enseignant.specialite)
        resultChapitres = []
        for chapitre in chapitres:
            resultChapitres.append({
                            "id": chapitre.idChapitre,
                            "intitule": chapitre.intitule,
                            "nbQuestions": len(Question.objects.filter(chapitre=chapitre))
                        })
        content = {
            "chapitres":resultChapitres
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_questions_by_chapitre(request):
    if request.method == "GET":
        chapitreIntitule = request.GET.get("chapitreIntitule", None)
        questions = None
        if chapitreIntitule:
            questionsQuery = Question.objects.filter(chapitre__intitule=chapitreIntitule)
            serializedQuestions = None
        content = {
            "questions": serializedQuestions.data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def create_devoir(request):
    if request.method == "POST":
        form = DevoirForm(request.POST)
        enseignant = Enseignant.objects.filter(user=request.user).first()
        content = None
        if form.is_valid():
            devoir = form.save(commit=False)
            periodeDF = devoir.periode.split("-")
            idQuestionsSplit = [int(id) for id in list(set(devoir.idsQuestions.split(',')))]
            classe = devoir.classe
            quizz = Quizz()
            quizz.createur = request.user
            quizz.type = TYPEENTRAINEMENT
            quizz.save()
            questions = Question.objects.filter(idQuestion__in=idQuestionsSplit)
            for question in questions:
                quizz.questions.add(question)
            mondevoir = Devoir()
            mondevoir.dateDebut = datetime.strptime(periodeDF[0], "%m/%d/%Y %I:%M %p ")
            mondevoir.dateFin = datetime.strptime(periodeDF[1], " %m/%d/%Y %I:%M %p")
            mondevoir.duree = devoir.duree
            mondevoir.nombreEssai = devoir.nombreEssai
            mondevoir.quizz = quizz
            mondevoir.classe = classe
            mondevoir.save()
            content = {
                "questions": periodeDF
            }
        else:
            return HttpResponse(json.dumps({"error": form.errors }), content_type='application/json')
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_quizz(request, idQuizz=None):
    if request.method == "GET":
        quizz = Quizz.objects.filter(idQuizz=idQuizz).first()
        content = {}
        if quizz:
            content["quizz"] = QuizzSerializer(quizz).data
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_quizz_correction(request, idQuizz=None):
    if request.method == "GET":
        quizz = Quizz.objects.filter(idQuizz=idQuizz).first()
        content = {}
        if quizz:
            content["quizz"] = QuizzCorrectionSerializer(quizz).data
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def profile_save(request):
    if request.POST:
        eleveForm = EleveForm(request.POST)
        if eleveForm.is_valid():
            instance = eleveForm.save(commit=False)
            eleve = Eleve.objects.filter(user=request.user).first()
            eleve.nom = instance.nom
            eleve.prenom = instance.prenom
            eleve.sexe = instance.sexe
            eleve.dateNaissance = instance.dateNaissance
            eleve.lieuNaissance = instance.lieuNaissance
            eleve.telephone = instance.telephone
            eleve.niveau = instance.niveau
            eleve.etablissement = instance.etablissement
            eleve.lieuEtablissement = instance.lieuEtablissement
            if instance.niveau == "Terminale":
                eleve.choix1 = instance.choix1
                eleve.choix2 = instance.choix2
                eleve.choix3 = instance.choix3
            eleve.save()
        content = {
            "status":True
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def soumettre_reponses_devoir(request):
    if request.method == "GET":
        questions = request.GET.get("questions", None)
        idFeuilleEleve = request.GET.get("idFeuilleEleve", None)
        note = request.GET.get("note", None)
        total = request.GET.get("total", None)
        feuilleEleve = FeuilleEleve.objects.filter(id=idFeuilleEleve).first()
        feuilleEleve.reponses = json.dumps({
                "questions": questions,
                "note": note,
                "total": total
        })
        feuilleEleve.save(update_fields=['reponses'])
        content = {
            "status": True
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def afficher_reponses_devoir(request, devoirID=None):
    if request.method == "GET":
        devoir = Devoir.objects.filter(id=devoirID).first()
        feuilleEleve = FeuilleEleve.objects.filter(devoir=devoir).order_by('date').first()
        reponses = feuilleEleve.reponses
        content = None
        if reponses:
            myreponses = json.loads(reponses)
            quizzSerialized = QuizzSerializer(feuilleEleve.devoir.quizz).data
            for question in quizzSerialized['questions']:
                for proposition in question['propositions']:
                    idQuestion = str(question['idQuestion'])
                    idProposition = str(proposition['idProposition'])
                    proposition['checked'] = myreponses[idQuestion][idProposition]
            content = {"quizz": quizzSerialized, "reponses":myreponses}
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def inscription(request):
    if request.method == "GET":
        classeID = request.GET.get("classeID", None)
        classe = Classe.objects.filter(idClass=classeID).first()
        inscription = Inscription()
        inscription.classe = classe
        inscription.annee = date.today()
        inscription.eleve = Eleve.objects.filter(user=request.user).first()
        inscription.save()
        content = {
            "idDemande": inscription.id
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_eleve(request):
    if request.method == "GET":
        eleveID = request.GET.get("eleveID", None)
        eleve = Eleve.objects.filter(idEleve=eleveID).first()
        content = {
            "eleve": EleveSerializer(eleve).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_cours_list(request):
    if request.method == "GET":
        cours = Classe.objects.all()
        content = {
            "cours_list": ClasseSerializer(cours).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404



def refresh_nouvelle_question_form(request):
    if request.method == "GET":
        form = Creation_Question_Form()
        content = {
            "formQuestion": form
        }
        html = render_to_string('cours/nouvelle_question.html', content)
        return HttpResponse(html)
    else:
        raise Http404


def get_classe_of_groupe(request):
    if request.method == "GET":
        groupeID = request.GET.get("groupeID", None)
        classes = Classe.objects.filter(groupe__idGroupeDeSoutien=groupeID)
        content = {
            "classes": ClasseMinInfoSerializer(classes, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_chapitres_of_classe(request):
    if request.method == "GET":
        classeID = request.GET.get("classeID", None)
        chapitres = ChapitreClasse.objects.filter(classe__idClass=classeID)
        content = {
            "chapitres": ChapitreClasseSerializer(chapitres, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_chapitres_of_classe_more_info(request):
    if request.method == "GET":
        classeID = request.GET.get("classeID", None)
        chapitres = ChapitreClasse.objects.filter(classe__idClass=classeID)
        content = {
            "chapitres": ChapitreClasseMoreInfoSerializer(chapitres, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_questions_of_chapitre(request):
    if request.method == "GET":
        id = request.GET.get("id", None)
        questionsQuery = Question.objects.filter(chapitre_id=id)
        serializedQuestions = PaginatedQuestionSerializer(questionsQuery, request, 2)
        content = {
            "reponses": serializedQuestions.data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def supprimer_une_question(request):
    if request.method == "GET":
        idQuestion = request.GET.get("idQuestion", None)
        question = Question.objects.filter(idQuestion=idQuestion).first()
        question.delete()
        content = {
            "status": True
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def assignment_top(request):
    if request.method == "GET":
        classeID = request.GET.get("classeID", None)
        classe = Classe.objects.filter(idClass=int(classeID)).first()
        chapitres = ChapitreClasse.objects.filter(classe=classe, dateDebut__lte=date.today())
        programme = []
        for chapitre in chapitres:
            devoirsList = Devoir.objects.filter(chapitre=chapitre, dateDebut__lte=date.today())
            devoirs = []
            for devoir in devoirsList:
                devoirFait = False
                if FeuilleEleve.objects.filter(eleve=request.user, devoir=devoir):
                    devoirFait = True
                devoirs.append({
                    "fait":devoirFait,
                    "data":DevoirMinInfoSerializer(devoir).data
                })
            chapitreFait = False
            if ChapitreFait.objects.filter(chapitre=chapitre):
                chapitreFait = True
            programme.append({
                "chapitre": ChapitreClasseSerializer(chapitre).data,
                "devoirs": devoirs,
                "fait":chapitreFait
            })
        content = {
            "classe": ClasseMinInfoSerializer(classe).data,
            "programme":programme
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_post_chapitre_list(request):
    if request.GET:
        idChapitre = request.GET.get("idChapitre", None)
        chapitre = ChapitreClasse.objects.filter(id=idChapitre)
        queryset_list = Post.objects.filter(chapitre=chapitre)
        paginator = Paginator(queryset_list, 3)

        page = request.GET.get('page')
        try:
            posts = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            posts = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            posts = paginator.page(paginator.num_pages)

        postsReturn = []
        for post in posts.object_list:
            comments = []
            for mycomment in post.comments:
                children = []
                if mycomment:
                    eleve = Eleve.objects.filter(user=mycomment.user).first()
                    masculin = True
                    if eleve:
                        if eleve.sexe != "Masculin":
                            masculin = False
                    else:
                        enseignant = Enseignant.objects.filter(user=mycomment.user).first()
                        if enseignant.sexe != "Masculin":
                            masculin = False
                    comments.append({
                        "user": mycomment.user.get_full_name(),
                        "content":mycomment.content,
                        "masculin": masculin,
                        "date": mycomment.timestamp.strftime("%d-%m-%Y %H:%M:%S"),
                    })
            eleve = Eleve.objects.filter(user=post.user).first()
            masculin = True
            if eleve:
                if eleve.sexe != "Masculin":
                    masculin = False
            else:
                enseignant = Enseignant.objects.filter(user=post.user).first()
                if enseignant.sexe != "Masculin":
                    masculin = False
            postsReturn.append({
                "id":post.id,
                "user": post.user.get_full_name(),
                "masculin": masculin,
                "title":post.title,
                "content":post.content,
                "date": post.timestamp.strftime("%d-%m-%Y %H:%M:%S"),
                "comments":comments,
                "nbComments": len(comments)
            })


        content = {
            "posts":postsReturn
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def envoyer_un_commentaire(request):
    if request.GET:
        idPost = request.GET.get("idPost", None)
        contenu = request.GET.get("contenu", None)
        post = Post.objects.filter(id=idPost).first()
        comment = Comment()
        comment.user = request.user
        comment.object_id = post.id
        comment.content = contenu
        comment.content_type = post.get_content_type
        comment.parent = None
        comment.save()
        masculin = True
        eleve = Eleve.objects.filter(user=request.user).first()
        if eleve:
            if eleve.sexe != "Masculin":
                masculin = False
        else:
            enseignant = Enseignant.objects.filter(user=request.user).first()
            if enseignant.sexe != "Masculin":
                masculin = False
        content = {
            "comment":{
                "content": comment.content,
                "user": request.user.get_full_name(),
                "date": comment.timestamp.strftime("%d-%m-%Y %H:%M:%S"),
                "masculin": masculin,
            }
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def get_filtre(request):
    if request.GET:
        matieres = request.GET.getlist("matieres", None)
        niveaux = request.GET.getlist("niveaux", None)
        groupes = request.GET.getlist("groupes", None)
        classes = Classe.objects.filter(publier=True)
        if "None" not in matieres or "None" not in niveaux or "None" not in groupes:
            if matieres and len(matieres)>0:
                classes = classes.filter(matiere__in=matieres)
            if niveaux and len(niveaux)>0:
                classes = classes.filter(niveau__in=niveaux)
            if groupes and len(groupes)>0:
                classes = classes.filter(groupe__nom__in=groupes)
        serializedClasses = PaginatedClasseSerializer(classes, request, 100)
        content = {
            "classes": serializedClasses.data,
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404
def categories(request):
    if request.GET:
        classes = Classe.objects.filter(publier=True)
        serializedClasses = PaginatedClasseSerializer(classes, request, 100)
        groupes = []
        niveaux = []
        matieres = []
        for classe in classes:
            if classe.niveau not in niveaux:
                niveaux.append(classe.niveau)
            if classe.matiere not in matieres:
                matieres.append(classe.matiere)
            if classe.groupe.nom not in groupes:
                groupes.append(classe.groupe.nom)

        content = {
            "classes": serializedClasses.data,
            "groupes": groupes,
            "niveaux": niveaux,
            "matieres": matieres
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_chapitre_all_info(request):
    if request.GET:
        chapitreID = request.GET.get("chapitreID", None)
        chapitre = ChapitreClasse.objects.filter(id=chapitreID).first()
        content = {
            "chapitre": ChapitreClasseAllInfoSerializer(chapitre).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def verifier_inscrit_ou_enseignant(request):
    if request.GET:
        content = None
        if request.user.is_anonymous:
            content = {
                "eleveInscrit": False,
                "prof": False
            }
        else:
            username = request.GET.get("username", None)
            classeID = request.GET.get("classeID", None)
            eleve = Eleve.objects.filter(user__username=username).first()
            enseignant = Classe.objects.filter(idClass=classeID, enseignant__user=request.user).first()
            if Inscription.objects.filter(eleve__user__username=username, classe__idClass=classeID).first():
                content = {
                    "eleveInscrit": True,
                    "prof": False
                }
            elif enseignant:
                content = {
                    "eleveInscrit": False,
                    "prof": True
                }
            else:
                content = {
                    "eleveInscrit": False,
                    "prof": False
                }

        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def copie_eleve_of_devoir(request):
    if request.GET:
        devoirID = request.GET.get("devoirID", None)
        devoir = Devoir.objects.filter(id=devoirID).first()
        feuille = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).order_by("-date").first()
        content = {
            "reponses": feuille.reponses
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def copies_eleve_by_devoir(request):
    if request.GET:
        content = None
        classeID = request.GET.get("classeID", None)
        copies_par_devoir = []
        devoirs = Devoir.objects.filter(classe__idClass=classeID)
        for devoir in devoirs:
            feuilles = FeuilleEleve.objects.filter(devoir=devoir, eleve=request.user).order_by("date")
            copies_par_devoir.append({
                "devoirID": devoir.id,
                "devoirIntitule": devoir.quizz.intitule,
                "copies":FeuilleEleveSerializer(feuilles, many=True).data
            })
        content = {
            "copiesParDevoir": copies_par_devoir
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def copies_eleves_classe(request):
    if request.GET:
        content = None
        classeID = request.GET.get("classeID", None)
        copies_des_eleves = []
        devoirs = Devoir.objects.filter(classe__idClass=classeID)
        chapitres = ChapitreClasse.objects.filter(classe__idClass=classeID)
        inscriptions = Inscription.objects.filter(classe__idClass=classeID)
        for inscription in inscriptions:
            copies_par_devoir = []
            for devoir in devoirs:
                feuilles = FeuilleEleve.objects.filter(devoir=devoir, eleve=inscription.eleve.user)
                copies_par_devoir.append({
                    "devoirID": devoir.id,
                    "devoirIntitule": devoir.quizz.intitule,
                    "chapitre": devoir.chapitre.titre,
                    "correction": QuizzCorrectionSerializer(devoir.quizz).data,
                    "copies":FeuilleEleveSerializer(feuilles, many=True).data
                })
            copies_des_eleves.append({
                "eleve" : EleveSerializer(inscription.eleve).data,
                "copiesParDevoir": copies_par_devoir
            })
        intitules = []
        for devoir in devoirs:
            intitules.append(str(devoir.quizz.intitule))
        content = {
            "copiesParEleve": copies_des_eleves,
            "devoirsIntitule": intitules,
            "chapitres": [chapitre.titre for chapitre in chapitres]
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_annonces(request):
    if request.GET:
        classeID = request.GET.get("classeID", None)
        annonces = Annonce.objects.filter(classe__idClass=classeID).order_by("date")
        content = {
            "annonces": AnnonceSerializer(annonces, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def save_configuration_of_question(request):
    if request.POST:
        content = None
        classeID = request.POST.get("classeID")
        question_form = QuestionForm(int(classeID), request.POST)
        if question_form.is_valid():
            instance = question_form.save(commit=False)
            instance.groupe = EnseigneA.objects.filter(enseignant__user=request.user).first().groupe
            instance.save()
            form = None
            initial = {
                "question": instance
            }
            if instance.type == "qcr" or instance.type == "qr":
                form = PropositionRelationnelleForm(initial=initial)
            elif instance.type == "qcm" or instance.type == "qru" or instance.type == "ci":
                form = PropositionForm(initial=initial)
            elif instance.type == "schema":
                form = PropositionSchemaForm(initial=initial)
            content = {
                "success": True,
                "form": form
            }
            return TemplateResponse(request, 'cours/propositionForm.html', content)
        else:
            content = {
                "success": False,
                "message": {f: e.get_json_data() for f, e in question_form.errors.items()}
            }
            return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def save_chapitre_classe(request):
    if request.POST:
        classeID = request.POST.get("classeID")
        form = Creation_Chapitre_Form(request.POST, request.FILES)
        content = None
        if form.is_valid():
            instance = form.save(commit=False)
            chapitre = ChapitreClasse.objects.filter(
                classe__idClass=classeID,
                contenu=instance.contenu
            ).first()
            if chapitre:
                if chapitre.contenu != instance.contenu:
                    chapitre.contenu = instance.contenu
                    chapitre.save(update_fields=['contenu'])
                    print("contenu")
                if chapitre.description != instance.description:
                    chapitre.description = instance.description
                    chapitre.save(update_fields=['description'])
                    print("description")
                if chapitre.titre != instance.titre:
                    chapitre.titre = instance.titre
                    chapitre.save(force_update=True, update_fields=['titre'])
                    print("titre")
                if chapitre.dateFin != instance.dateFin:
                    chapitre.dateFin = instance.dateFin
                    chapitre.save(update_fields=['dateFin'])
                    print("dateFin")
                if chapitre.dateDebut != instance.dateDebut:
                    chapitre.dateDebut = instance.dateDebut
                    chapitre.save(update_fields=['dateDebut'])
                    print("dateDebut")
                if chapitre.numero != instance.numero:
                    chapitre.numero = instance.numero
                    chapitre.save(update_fields=['numero'])
                    print("numero")
                chapitre.refresh_from_db()
            else:
                chapitre = ChapitreClasse()
                chapitre.classe = Classe.objects.filter(idClass=classeID).first()
                chapitre.contenu = instance.contenu
                chapitre.description = instance.description
                chapitre.titre = instance.titre
                chapitre.dateFin = instance.dateFin
                chapitre.dateDebut = instance.dateDebut
                chapitre.numero = instance.numero
                chapitre.save()
            chapitres = ChapitreClasse.objects.filter(classe__idClass=classeID)
            content = {
                "chapitres": ChapitreClasseMoreInfoSerializer(chapitres, many=True).data
            }
        else:
            content = {
                "success": False,
                "message": {f: e.get_json_data() for f, e in form.errors.items()}
            }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def save_proposition(request):
    if request.POST:
        idQuestion = request.POST.get("question")
        question = Question.objects.filter(idQuestion=int(idQuestion)).first()
        form = None
        propositions = None
        if question.type == "qcr":
            form = PropositionRelationnelleForm(request.POST)
            propositions = PropositionRelationnelle.objects.filter(question=question)
        elif question.type == "schema":
            form = PropositionSchemaForm(request.POST)
            propositions = PropositionSchema.objects.filter(question=question)
        elif question.type == "qcm":
            form = PropositionForm(request.POST)
            propositions = Proposition.objects.filter(question=question)
        elif question.type == "qroc":
            form = PropositionSchemaForm(request.POST)
            propositions = PropositionSchema.objects.filter(question=question)
        elif question.type == "qr":
            form = PropositionRelationnelleForm(request.POST)
            propositions = PropositionRelationnelle.objects.filter(question=question)
        elif question.type == "ci":
            form = PropositionForm(request.POST)
            propositions = Proposition.objects.filter(question=question)
        elif question.type == "qru":
            form = PropositionForm(request.POST)
            propositions = Proposition.objects.filter(question=question)
        if form.is_valid():
            instance = form.save(commit=False)
            if question.type == "qcm" or question.type == "qru" or question.type == "ci":
                if request.POST.get("solution", None):
                    instance.solution = True
                else:
                    instance.solution = False
            instance.checked = False
            instance.question = question
            instance.save()
            content = {
                "success": True,
                "type": question.type,
                "propositions": serializers.serialize("json", propositions)
            }
        else:
            content = {
                "success": False,
                "type": question.type,
                "message": {f: e.get_json_data() for f, e in form.errors.items()}
            }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def get_classe_devoir(request, classeID=None):
    if request.method=='GET':
        devoirs = Devoir.objects.filter(classe__idClass=classeID)
        content = {
            "devoirs": DevoirMinInfoSerializer(devoirs, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

def delete_devoir(request, devoirID=None, classeID=None):
    if request.method=='GET':
        devoir = Devoir.objects.filter(id=devoirID).delete()
        devoirs = Devoir.objects.filter(classe__idClass=classeID)
        content = {
            "devoirs": DevoirMinInfoSerializer(devoirs, many=True).data
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404


def save_devoir(request, classeID=None):
    if request.POST:
        form = Creation_TD_Form(classeID, request.POST)
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
                devoirs = Devoir.objects.filter(classe__idClass=classeID)
                content = {
                    "status": True,
                    "devoirs": DevoirMinInfoSerializer(devoirs, many=True).data
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
        raise Http404


def supprimer_proposition(request):
    if request.GET:
        idProposition = request.GET.get("idProposition")
        type = request.GET.get("type")
        if type == "qcr" or type == "qr":
            PropositionRelationnelle.objects.filter(idPropositionRelationnelle=int(idProposition)).delete()
        if type == "schema":
            PropositionSchema.objects.filter(idPropositionSchema=int(idProposition)).delete()
        if type == "qcm" or type == "ci" or type == "qru":
            Proposition.objects.filter(idProposition=int(idProposition)).delete()
        content = {
            "success": True,
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404

