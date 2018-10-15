from rest_framework.serializers import *
from ..models import *
from posts.models import *
from comments.models import *
from rest_framework import pagination
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

class PropositionSerializer(ModelSerializer):
    class Meta:
        model = Proposition
        fields = ['__all__']

class EleveSerializer(ModelSerializer):
    class Meta:
        model = Eleve
        fields = [
            'etablissement',
            'niveau',
            'choix1',
            'choix2',
            'choix3',
            'lieuEtablissement',
            'dateNaissance',
            'lieuNaissance',
            'nom',
            'sexe',
            'prenom',
        ]

class ModelDevoirFormSerializer(ModelSerializer):
    class Meta:
        model = ModelDevoirForm
        fields = ['idsQuestions', 'periode']

class QuestionSerializer(ModelSerializer):
    propositions = ReadOnlyField()
    class Meta:
        model = Question
        depth = 3
        fields = [
            'idQuestion',
            'enonce',
            'explication',
            'chapitre',
            'session',
            'numero',
            'partie',
            'type',
            'propositions',
            'fait',
        ]

class ChapitreClasseSerializer(ModelSerializer):
    class Meta:
        model = ChapitreClasse
        depth = 3
        fields = [
            'id',
            'titre',
        ]

class ChapitreClasseMoreInfoSerializer(ModelSerializer):
    class Meta:
        model = ChapitreClasse
        depth = 3
        fields = [
            'id',
            'titre',
            'numero',
            'dateFin',
            'dateDebut'
        ]

class ChapitreClasseAllInfoSerializer(ModelSerializer):
    class Meta:
        model = ChapitreClasse
        depth = 3
        fields = [
            'id',
            'titre',
            'numero',
            'dateFin',
            'description',
            'contenu',
            'dateDebut'
        ]

class QuizzSerializer(ModelSerializer):
    get_questions = ReadOnlyField()
    class Meta:
        model = Quizz
        fields = [
            'idQuizz',
            'intitule',
            'get_questions',
        ]

class QuizzCorrectionSerializer(ModelSerializer):
    get_corrections = ReadOnlyField()
    class Meta:
        model = Quizz
        fields = [
            'idQuizz',
            'intitule',
            'get_corrections',
        ]

class ClasseSerializer(ModelSerializer):
    groupe_name = CharField(source='groupe.nom')
    enseignant_name = CharField(source='enseignant.nom')
    enseignant_surname = CharField(source='enseignant.prenom')
    class Meta:
        model = Classe
        depth = 4
        fields = [
            'idClass',
            'description',
            'nom',
            'prix',
            'dateDebut',
            'dateFin',
            'dateFinInscription',
            'enseignant_name',
            'enseignant_surname',
            'groupe_name',
            'matiere',
            'logo',
            'niveau'
        ]

class ClasseMinInfoSerializer(ModelSerializer):
    class Meta:
        model = Classe
        fields = [
            'idClass',
            'nom',
        ]

class DevoirMinInfoSerializer(ModelSerializer):
    chapitre_titre = CharField(source='chapitre.titre')
    class Meta:
        model = Devoir
        fields = [
            'id',
            'titre',
            'dateDebut',
            'dateFin',
            'chapitre_titre',
        ]

class CommentSerializer(ModelSerializer):
    user_name = CharField(source='user.get_full_name')
    children = ReadOnlyField()
    class Meta:
        model = Comment
        fields = [
            "children",
            "user_name",
            "content"
        ]

class FeuilleEleveSerializer(ModelSerializer):
    class Meta:
        model = FeuilleEleve
        fields = [
            "reponses",
            "date"
        ]

class PostSerializer(ModelSerializer):
    user_name = CharField(source='user.get_full_name')
    comments = ReadOnlyField()
    class Meta:
        model = Post
        depth = 4
        fields = [
            "user_name",
            "content",
            "title",
            "id",
            "comments",
        ]

class AnnonceSerializer(ModelSerializer):
    auteur = CharField(source='classe.enseignant.nom')
    class Meta:
        model = Annonce
        depth = 4
        fields = [
            "annonce",
            "date",
            "titre",
            "auteur"
        ]

class PaginatedQuestionSerializer():
    def __init__(self, questions, request, num):
        paginator = Paginator(questions, num)
        page = request.GET.get('page')
        try:
            questions = paginator.page(page)
        except PageNotAnInteger:
            questions = paginator.page(1)
        except EmptyPage:
            questions = paginator.page(paginator.num_pages)
        count = paginator.count

        previous = None if not questions.has_previous() else questions.previous_page_number()
        next = None if not questions.has_next() else questions.next_page_number()
        serializer = QuestionSerializer(questions, many=True)
        self.data = {
            'count':count,
            'previous':previous,
            'next':next,
            'actual': questions.number,
            'questions':serializer.data
        }

class PaginatedClasseSerializer():
    def __init__(self, classes, request, num):
        paginator = Paginator(classes, num)
        page = request.GET.get('page')
        try:
            classes = paginator.page(page)
        except PageNotAnInteger:
            classes = paginator.page(1)
        except EmptyPage:
            classes = paginator.page(paginator.num_pages)
        count = paginator.count

        previous = None if not classes.has_previous() else classes.previous_page_number()
        next = None if not classes.has_next() else classes.next_page_number()
        serializer = ClasseSerializer(classes, many=True)
        self.data = {
            'count':count,
            'previous':previous,
            'next':next,
            'actual': classes.number,
            'classes':serializer.data
        }

