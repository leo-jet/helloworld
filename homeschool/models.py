# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
from django.core import serializers
import os
# Create your models here.

PHY = "PHYSIQUES"
CHI = "CHIMIE"
BIO = "BIOLOGIE"
INFO = "INFORMATIQUE"
LNG = "LANGUE"
CG = "CULTURE GENERALE"
MED = "CULTURE MEDICALE"
AN = "ANCIENNES EPREUVES"
MAT = "MATHEMATIQUES"
ANG = "ANGLAIS"

MATIERE_CHOIX = (
    (PHY, "PHYSIQUES"),
    (INFO, "INFORMATIQUE"),
    (CHI, "CHIMIE"),
    (BIO, "BIOLOGIE"),
    (LNG, "LANGUE"),
    (CG, "CULTURE GENERALE"),
    (MED, "CULTURE MEDICALE"),
    (AN, "ANCIENNES EPREUVES"),
    (MAT, "MATHEMATIQUES"),
    (ANG, "ANGLAIS"),

)

PARTIE0 = "Partie 0"
PARTIE1 = "Partie I"
PARTIE2 = "Partie II"
PARTIE3 = "Partie III"
PARTIE4 = "Partie IV"
PARTIE5 = "Partie V"

PARTIE_CHOIX = (
    (PARTIE1, "Partie I"),
    (PARTIE2, "Partie II"),
    (PARTIE3, "Partie III"),
    (PARTIE4, "Partie IV"),
    (PARTIE5, "Partie V"),
)
SESSION2002 = "2002"
SESSION2003 = "2003"
SESSION2004 = "2004"
SESSION2005 = "2005"
SESSION2006 = "2006"
SESSION2007 = "2007"
SESSION2008 = "2008"
SESSION2010 = "2010"
SESSION2011 = "2011"
SESSION2012 = "2012"
SESSION2013 = "2013"
SESSION2014 = "2014"
SESSION2015 = "2015"
SESSION2016 = "2016"

NIVEAU1 = "1"
NIVEAU2 = "3"

TYPEEPREUVE = "EPREUVE"
TYPEENTRAINEMENT = "ENTRAINEMENT"
TYPE_QUIZZ = (
    (TYPEENTRAINEMENT, "ENTRAINEMENT"),
    (TYPEEPREUVE, "EPREUVE")
)
MASCULIN = "Masculin"
FEMININ = "Féminin"
SEXE = (
    (MASCULIN, "Masculin"),
    (FEMININ, "Féminin")
)
SESSION_CHOIX = (
    (SESSION2010, "2002"),
    (SESSION2010, "2003"),
    (SESSION2010, "2004"),
    (SESSION2010, "2005"),
    (SESSION2010, "2006"),
    (SESSION2010, "2007"),
    (SESSION2010, "2010"),
    (SESSION2011, "2011"),
    (SESSION2012, "2012"),
    (SESSION2013, "2013"),
    (SESSION2014, "2014"),
    (SESSION2015, "2015"),
    (SESSION2016, "2016"),
)
TLEA = "Terminale A"
TLEB = "Terminale A"
TLEC = "Terminale C"
TLED = "Terminale D"
TLE = "Terminale"
PRE = "Première"
SDE = "Seconde"
TRO = "Troisième"
QUA = "Quatrième"
CIN = "Cinquième"
SIX = "Sixième"
EG = "Enseignement Generale"
NIVEAU_CHOIX = (
    (TLE, "Terminale"),
    (PRE, "Première"),
    (SDE, "Seconde"),
    (TRO, "Troisième"),
    (QUA, "Quatrième"),
    (CIN, "Cinquième"),
    (SIX, "Sixième"),
)

ENSP = "Ecole Nationale Supérieure Polytechnique de Yaoundé"
MEDECINE = "Ecole de Médecine"
FGI = "Faculté du Génie Industriel"
FASA = "Faculté d'Agronomie et des Sciences Agricoles"

ECOLES = (
    (ENSP, "Ecole Nationale Supérieure Polytechnique de Yaoundé"),
    (MEDECINE, "Ecole de Médecine"),
    (FGI, "Faculté du Génie Industriel"),
    (FASA, "Faculté d'Agronomie et des Sciences Agricoles")
)

ECOLES_CONCOURS = (
    ("ensp", "Ecole Nationale Supérieure Polytechnique de Yaoundé"),
    ("medecine", "Ecole de Médecine"),
    ("fmsb", "Faculté de médecine et des sciences biomédicales"),
    ("fgi", "Faculté du Génie Industriel"),
    ("fasa", "Faculté d'Agronomie et des Sciences Agricoles")
)


class Personne(models.Model):
    user = models.OneToOneField(User)
    dateNaissance = models.DateField(auto_now=False, blank=True, null=True)
    lieuNaissance = models.CharField(max_length=128, blank=True, null=True)
    nom = models.CharField(max_length=128, blank=True, null=True)
    prenom = models.CharField(max_length=128, blank=True, null=True)
    sexe = models.CharField(max_length=50, choices=SEXE, default=MASCULIN)
    telephone = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(default="leo@labas.in")
    situation = models.CharField(max_length=128, blank=True, null=True, default="Pas encore renseigné !")
    def __unicode__(self):
        return self.user.username

    def __str__(self):
        return self.user.username

    class Meta:
        unique_together = (("user", "dateNaissance"),)
        abstract = True

class Enseignant(Personne):
    idEnseignant = models.AutoField(primary_key=True)
    specialite = models.CharField(max_length=50, choices=MATIERE_CHOIX, default=BIO)

    def __unicode__(self):
        return self.user.username

    def __str__(self):
        return self.user.username

class Eleve(Personne):
    idEleve = models.AutoField(primary_key=True)
    active = models.BooleanField()
    etablissement = models.CharField(max_length=50,null=True, blank=True)
    niveau = models.CharField(max_length=50, choices=NIVEAU_CHOIX,null=True, blank=True)
    choix1 = models.CharField(max_length=50, choices=ECOLES,null=True, blank=True)
    choix2 = models.CharField(max_length=50, choices=ECOLES,null=True, blank=True)
    choix3 = models.CharField(max_length=50, choices=ECOLES,null=True, blank=True)
    lieuEtablissement = models.CharField(max_length=50,null=True, blank=True)

    def __unicode__(self):
        return self.user.username

    def __str__(self):
        return self.user.username

class Etablissement(models.Model):
    nom = models.CharField(max_length=128, primary_key=True)
    description = models.CharField(max_length=128, default="Test")
    adresse = models.CharField(max_length=128, default="Test")
    logo = models.ImageField(null=True, blank=True)
    def __unicode__(self):
        return self.nom

    def __str__(self):
        return self.nom

class GroupeDeSoutien(Etablissement):
    idGroupeDeSoutien = models.AutoField(primary_key=True)

    def __unicode__(self):
        return self.nom

    def __str__(self):
        return self.nom

class Chapitre(models.Model):
    idChapitre = models.AutoField(primary_key=True)
    intitule = models.CharField(max_length=128, default="Test")
    matiere = models.CharField(max_length=50, choices=MATIERE_CHOIX, default=BIO)

    def __unicode__(self):
        return self.intitule

    def __str__(self):
        return self.intitule

    class Meta:
        unique_together = ("intitule", "matiere")


class Classe(models.Model):
    idClass = models.AutoField(primary_key=True)
    description = models.TextField(max_length=20000, default="Description de la classe")
    nom = models.CharField(max_length=50, default="Nom de la classe")
    prix = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10000000)])
    dateDebut = models.DateTimeField(blank=True, null=True)
    dateFin = models.DateTimeField(blank=True, null=True)
    dateFinInscription = models.DateTimeField(blank=True, null=True)
    enseignant = models.ForeignKey(Enseignant)
    groupe = models.ForeignKey(GroupeDeSoutien)
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    logo = models.ImageField()
    publier = models.BooleanField()
    tags = models.CharField(max_length=100000, null=True, blank=True)
    matiere = models.CharField(max_length=50, choices=MATIERE_CHOIX, default=BIO)
    niveau = models.CharField(max_length=50, choices=NIVEAU_CHOIX, default=SIX)

    def __unicode__(self):
        return str(self.idClass)

    def __str__(self):
        return str(self.idClass)

    def get_groupe_name(self):
        return self

    def save(self):
        # Opening the uploaded image
        im = Image.open(self.logo)

        output = BytesIO()

        # Resize/modify the image
        im = im.resize((270, 161))

        # after modifications, save it to the output
        im.save(output, format='JPEG', quality=100)
        output.seek(0)

        # change the imagefield value to be the newley modifed image value
        self.logo = InMemoryUploadedFile(output, 'ImageField', "%s.jpg" % self.logo.name.split('.')[0], 'image/jpeg',
                                        sys.getsizeof(output), None)

        super(Classe, self).save()

class Inscription(models.Model):
    eleve = models.ForeignKey(Eleve)
    classe = models.ForeignKey(Classe)
    annee = models.DateField(auto_now=False)

    class Meta:
        unique_together = ("eleve", "classe", "annee")

    def __str__(self):
        return str(self.eleve)




class Schema(models.Model):
    idSchema = models.AutoField(primary_key=True)
    description = models.CharField(default="description", max_length=50)
    image = models.FileField(upload_to="images/")

class AnnotationNom(models.Model):
    idAnnotation = models.AutoField(primary_key=True)
    annotation = models.CharField(default="annotation", max_length=50)
    image = models.ForeignKey(Schema)
    numero = models.IntegerField()

    def __str__(self):
        return self.annotation

class ModelDevoirForm(models.Model):
    idsQuestions = models.CharField(default="idQuestions", max_length=300)
    periode = models.CharField(default="rangeDateTime", max_length=300)
    duree = models.CharField(default="time", max_length=300)
    nombreEssai = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    classe = models.ForeignKey(Classe)

class DemandeInscription(models.Model):
    eleve = models.ForeignKey(User)
    classe = models.ForeignKey(Classe)
    class Meta:
        unique_together = ("classe", "eleve")

PRIX = (
    ('gratuit', 'Gratuit',),
    ('payant', 'Payant',)
)

TYPE_QUESTION = (
    ("qcm", "Question à choix multiples"),
    ("qcr", "Question à complément relationnel"),
    ("qroc", "Question à réponse ouverte et courte"),
    ("qr", "Question relationnelle"),
    ("ci", "Choix de l'intrus"),
    ("qru", "Question à réponse unique"),
    ("schema", "Annotation de schéma")
)

class Basic_Information(models.Model):
    logo = models.ImageField( null=True, blank=True)
    video = models.FileField( null=True, blank=True)
    description = models.CharField(max_length=100000, null=True, blank=True)
    descriptionHidden = models.TextField(null=True, blank=True)
    titre = models.CharField(max_length=100000, null=True, blank=True)
    dateOuverture = models.CharField(max_length=100, null=True, blank=True)
    dateFinInscription = models.CharField(max_length=100, null=True, blank=True)
    dateFinCours = models.CharField(max_length=100, null=True, blank=True)
    montant = models.IntegerField(default=0, validators=[MaxValueValidator(100000), MinValueValidator(0)] )
    matiere = models.CharField(max_length=50, choices=MATIERE_CHOIX, default=BIO)

class Creation_Chapitre(models.Model):
    contenu = models.TextField(max_length=100000,null=True, blank=True)
    description = models.CharField(max_length=100000, null=True, blank=True)
    descriptionHidden = models.TextField(null=True, blank=True)
    titre = models.CharField(max_length=100000)
    dateDebut = models.CharField(max_length=100)
    dateFin = models.CharField(max_length=100)
    numero = models.IntegerField(default=1, validators=[MaxValueValidator(25), MinValueValidator(1)])
    def __str__(self):
        return str(self.titre)

class EnseigneA(models.Model):
    enseignant = models.ForeignKey(Enseignant)
    groupe = models.ForeignKey(GroupeDeSoutien)


class ChapitreClasse(models.Model):
    contenu = models.TextField(max_length=100000, null=True, blank=True)
    description = models.TextField(max_length=100000, null=True, blank=True)
    titre = models.CharField(max_length=100000, null=True, blank=True)
    dateDebut = models.DateField(null=True, blank=True)
    dateFin = models.DateField(null=True, blank=True)
    classe = models.ForeignKey(Classe)
    numero = models.IntegerField(default=1, validators=[MaxValueValidator(25), MinValueValidator(1)])

    def __str__(self):
        return str(self.titre)

    class Meta:
        unique_together = (("classe", "numero"),)


class Question(models.Model):
    idQuestion = models.AutoField(primary_key=True)
    enonce = models.TextField(max_length=1000, default="Enonce question", blank=True, null=True)
    explication = models.TextField(max_length=10001, default="Explication reponse", blank=True, null=True)
    type = models.CharField(max_length=50, choices=TYPE_QUESTION, default="qcm")
    chapitre = models.ForeignKey(ChapitreClasse)
    session = models.CharField(max_length=50, choices=SESSION_CHOIX, default=SESSION2010)
    numero = models.IntegerField(blank=True, null=True)
    partie = models.CharField(max_length=50, blank=True, null=True)
    concours = models.CharField(max_length=20, choices=ECOLES_CONCOURS, default="fmsb")
    groupe = models.ForeignKey(GroupeDeSoutien)
    fait = models.BooleanField(default=False)
    def __unicode__(self):
        return str(self.idQuestion)

    def __str__(self):
        return str(self.idQuestion)

    def propositions(self): #replies
        propositions = []
        if self.type == "qcr" or self.type == "qr":
            propositions = [
                {
                    'id': proposition.idPropositionRelationnelle,
                    'enonceA': proposition.enonceA,
                    'enonceB': proposition.enonceB,
                    "reponse": proposition.reponse
                }
                for proposition in PropositionRelationnelle.objects.filter(question=self)
                ]
        if self.type == "schema":
            propositions = [
                {
                    'id': proposition.idPropositionSchema,
                    'numero': proposition.numero,
                    'annotation': proposition.annotation,
                    "reponse": proposition.reponse
                }
                for proposition in PropositionSchema.objects.filter(question=self)
                ]
        if self.type == "qcm" or self.type == "ci" or self.type == "qru":
            propositions = [
                {
                    'id': proposition.idProposition,
                    'enonce': proposition.enonce,
                    'checked': False,
                }
                for proposition in Proposition.objects.filter(question=self)
                ]
        print(propositions)
        return propositions


class Proposition(models.Model):
    idProposition = models.AutoField(primary_key=True)
    enonce = models.TextField(max_length=1000, default="Test", blank=True, null=True)
    solution = models.BooleanField(default=False)
    checked = models.BooleanField(default=False)
    question = models.ForeignKey(Question)
    def __unicode__(self):
        return str(self.idProposition)

    def __str__(self):
        return str(self.idProposition)


class PropositionRelationnelle(models.Model):
    idPropositionRelationnelle = models.AutoField(primary_key=True)
    enonceA = models.CharField(max_length=1000, default="element A", blank=True, null=True)
    enonceB = models.CharField(max_length=1001, default="element B", blank=True, null=True)
    reponse = models.CharField(max_length=1001, default="-", blank=True, null=True)
    question = models.ForeignKey(Question)

    def __unicode__(self):
        return str(self.idPropositionRelationnelle)

    def __str__(self):
        return str(self.idPropositionRelationnelle)

    def enonces(self):
        propositions = PropositionRelationnelle.objects.filter(question=self.question)
        enonces = [proposition.enonceB for proposition in propositions]
        return enonces

class PropositionReponseOuverteCourte(models.Model):
    idPopositionQROC = models.AutoField(primary_key=True)
    enonce = models.TextField(max_length=10000, default="element A", blank=True, null=True)
    question = models.ForeignKey(Question)

    def __unicode__(self):
        return str(self.idPopositionQROC)

    def __str__(self):
        return str(self.idPopositionQROC)


class PropositionSchema(models.Model):
    idPropositionSchema = models.AutoField(primary_key=True)
    numero = models.IntegerField(validators=[MaxValueValidator(30), MinValueValidator(1)])
    annotation = models.CharField(max_length=1000, default="Annontation", blank=True, null=True)
    reponse = models.CharField(max_length=1000, default="-", blank=True, null=True)
    question = models.ForeignKey(Question)

    def __unicode__(self):
        return str(self.idPropositionSchema)

    def __str__(self):
        return str(self.idPropositionSchema)

    class Meta:
        app_label = "homeschool"

class QuestionRelationnelle(models.Model):
    idQuestionRelationnelle = models.AutoField(primary_key=True)
    enonce = models.TextField(max_length=1000, default="Enonce question", blank=True, null=True)
    explication = models.TextField(max_length=10000, default="Explication reponse", blank=True, null=True)
    session = models.CharField(max_length=50, choices=SESSION_CHOIX, default=SESSION2010)
    publier = models.BooleanField(default=False)
    numero = models.IntegerField(blank=True, null=True)
    chapitre = models.ForeignKey(Chapitre)
    propositions = models.ManyToManyField(PropositionRelationnelle)
    partie = models.CharField(max_length=20, choices=PARTIE_CHOIX, default=PARTIE0)

    def __unicode__(self):
        return self.chapitre.intitule
    def __str__(self):
        return self.chapitre.intitule


class Quizz(models.Model):
    idQuizz = models.AutoField(primary_key=True)
    consignes = models.TextField(max_length=50, default="Intitule du Quiz", blank=True, null=True)
    dateCreation = models.DateTimeField(auto_now=True, blank=True, null=True)
    intitule = models.CharField(max_length=50, default="Intitule du Quiz", blank=True, null=True)
    questions = models.ManyToManyField(Question)
    createur = models.ForeignKey(User, related_name="createur_quiz")

    class Meta:
        unique_together = (("dateCreation", "intitule"),)
    def __unicode__(self):
        return str(self.idQuizz)
    def __str__(self):
        return str(self.idQuizz)

    def get_questions(self):
        questionsList = []
        for quest in self.questions.all():
            propositions = []
            enonceBListe = []
            annotationListe = []
            if quest.type == "qcr" or quest.type == "qr":
                for proposition in PropositionRelationnelle.objects.filter(question=quest):
                    propositions.append(
                    {
                        'id': proposition.idPropositionRelationnelle,
                        'enonceA': proposition.enonceA,
                        "reponse": proposition.reponse
                    })
                    enonceBListe.append(proposition.enonceB)

            if quest.type == "schema":
                for proposition in PropositionSchema.objects.filter(question=quest):
                    propositions.append(
                    {
                        'id': proposition.idPropositionSchema,
                        'numero': proposition.numero,
                        "reponse": proposition.reponse
                    })
                    annotationListe.append(proposition.annotation)
            if quest.type == "qcm" or quest.type == "ci" or quest.type == "qru":
                propositions = [
                    {
                        'id': proposition.idProposition,
                        'enonce': proposition.enonce,
                        'checked': False,
                    }
                    for proposition in Proposition.objects.filter(question=quest)
                    ]
            questionsList.append({
                "idQuestion":quest.idQuestion,
                "type": quest.type,
                "partie" : quest.partie,
                "enonce": quest.enonce,
                "explication": quest.explication,
                "propositions": propositions,
                "enonceBListe": enonceBListe,
                "annotationListe": annotationListe
            })

        return questionsList

    def get_corrections(self):
        questionsList = []
        for quest in self.questions.all():
            propositions = []
            if quest.type == "qcr" or quest.type == "qr":
                for proposition in PropositionRelationnelle.objects.filter(question=quest):
                    propositions.append(
                    {
                        'id': proposition.idPropositionRelationnelle,
                        'enonceB': proposition.enonceB
                    })

            if quest.type == "schema":
                for proposition in PropositionSchema.objects.filter(question=quest):
                    propositions.append(
                    {
                        'id': proposition.idPropositionSchema,
                        'annotation': proposition.annotation
                    })
            if quest.type == "qcm" or quest.type == "ci" or quest.type == "qru":
                propositions = [
                    {
                        'id': proposition.idProposition,
                        'solution': proposition.solution,
                    }
                    for proposition in Proposition.objects.filter(question=quest)
                    ]
            questionsList.append({
                "idQuestion":quest.idQuestion,
                "type": quest.type,
                "partie" : quest.partie,
                "enonce": quest.enonce,
                "explication": quest.explication,
                "propositions": propositions,
            })
        return questionsList

class RepondA(models.Model):
    utilisateur = models.ForeignKey(User, related_name="utilisateur_quiz")
    quizz = models.ForeignKey(Quizz)
    note = models.IntegerField(validators=[MaxValueValidator(300), MinValueValidator(0)])
    dateReponse = models.DateTimeField(auto_now=True)
    duree = models.IntegerField(blank=True)

    class Meta:
        unique_together = ("dateReponse", "quizz")

    def __str__(self):
        return str(self.utilisateur.username)


    def __str__(self):
        return str(self.classe.idClass)

class Devoir(models.Model):
    quizz = models.ForeignKey(Quizz)
    dateDebut = models.DateField(blank=True, null=True)
    dateFin = models.DateField(blank=True, null=True)
    duree = models.CharField(default="time", max_length=300)
    nombreEssai = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    classe = models.ForeignKey(Classe)
    note = models.IntegerField(default=101, validators=[MinValueValidator(1), MaxValueValidator(101)])
    correction = models.BooleanField(default=False)
    chapitre = models.ForeignKey(ChapitreClasse)
    consignes = models.TextField(max_length=100000, null=True, blank=True)
    numeroDesQuestions = models.TextField(max_length=100000, null=True, blank=True)
    titre = models.CharField(max_length=100000, null=True, blank=True)
    def __unicode__(self):
        return self.classe.nom
    def __str__(self):
        return self.classe.nom

    def is_open_now(self):
        return self.dateDebut <= timezone.now() < self.dateFin


class FeuilleEleve(models.Model):
    devoir = models.ForeignKey(Devoir)
    eleve = models.ForeignKey(User)
    reponses = models.TextField(default="Pas de reponses actuellement", max_length=10000, null=True)
    date = models.DateTimeField(auto_now=True)
    def __unicode__(self):
        return self.eleve.username
    def __str__(self):
        return self.eleve.username
    class Meta:
        unique_together = ("devoir", "eleve", "reponses", "date")

class ChapitreSelector(models.Model):
    chapitre = models.ForeignKey(ChapitreClasse)

class Creation_TD(models.Model):
    consignes = models.TextField(max_length=100000, null=True, blank=True)
    numeroDesQuestions = models.TextField(max_length=100000, null=True, blank=True)
    consignesHidden = models.TextField(null=True, blank=True)
    chapitre = models.ForeignKey(ChapitreClasse)
    duree = models.CharField(max_length=10,null=True, blank=True)
    nombre_essai = models.IntegerField(null=True, blank=True)
    titre = models.CharField(max_length=100000, null=True, blank=True)
    dateDebut = models.CharField(max_length=100, null=True, blank=True)
    dateFin = models.CharField(max_length=100, null=True, blank=True)


class Creation_Question(models.Model):
    enonce = models.TextField(max_length=100000, null=True, blank=True)
    enonceHidden = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=50, choices=TYPE_QUESTION, default="qcm")
    explication = models.TextField(max_length=100000, null=True, blank=True)
    explicationHidden = models.TextField(null=True, blank=True)
    chapitre = models.ForeignKey(ChapitreClasse)
    qcm = models.NullBooleanField()
    session = models.CharField(max_length=50, choices=SESSION_CHOIX, default=SESSION2010, blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    partie = models.CharField(max_length=50, blank=True, null=True)
    concours = models.CharField(max_length=20, choices=ECOLES_CONCOURS, default="fmsb", blank=True, null=True)

    enonceProposition1 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition1Hidden = models.TextField(null=True, blank=True)
    reponseProposition1 = models.BooleanField(default=False)

    enonceProposition2 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition2Hidden = models.TextField(null=True, blank=True)
    reponseProposition2 = models.BooleanField(default=False)

    enonceProposition3 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition3Hidden = models.TextField(null=True, blank=True)
    reponseProposition3 = models.BooleanField(default=False)

    enonceProposition4 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition4Hidden = models.TextField(null=True, blank=True)
    reponseProposition4 = models.BooleanField(default=False)

    enonceProposition5 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition5Hidden = models.TextField(null=True, blank=True)
    reponseProposition5 = models.BooleanField(default=False)

    enonceProposition6 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition6Hidden = models.TextField(null=True, blank=True)
    reponseProposition6 = models.BooleanField(default=False)

    enonceProposition7 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition7Hidden = models.TextField(null=True, blank=True)
    reponseProposition7 = models.BooleanField(default=False)

    enonceProposition8 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition8Hidden = models.TextField(null=True, blank=True)
    reponseProposition8 = models.BooleanField(default=False)

    enonceProposition9 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition9Hidden = models.TextField(null=True, blank=True)
    reponseProposition9 = models.BooleanField(default=False)

    enonceProposition10 = models.TextField(max_length=100000, null=True, blank=True)
    enonceProposition10Hidden = models.TextField(null=True, blank=True)
    reponseProposition10 = models.BooleanField(default=False)

class TravauxDirigesClasse(models.Model):
    chapitre = models.ForeignKey(ChapitreClasse)
    consignes = models.TextField(max_length=100000, null=True, blank=True)
    numeroDesQuestions = models.TextField(max_length=100000, null=True, blank=True)
    duree = models.IntegerField(null=True, blank=True)
    quizz = models.ForeignKey(Quizz)
    nombre_essai = models.IntegerField(null=True, blank=True)
    titre = models.CharField(max_length=100000, null=True, blank=True)
    dateDebut = models.CharField(max_length=100, null=True, blank=True)
    dateFin = models.CharField(max_length=100, null=True, blank=True)
    classe = models.ForeignKey(Classe)
    def __str__(self):
        return str(self.classe.idClass)

class ChapitreFait(models.Model):
    utilisateur = models.ForeignKey(User)
    chapitre = models.ForeignKey(ChapitreClasse)

class SignUp(models.Model):
    nom = models.CharField(max_length=20)
    prenom = models.CharField(max_length=20)
    identifiant = models.CharField(max_length=20)
    email = models.EmailField()
    motdepass = models.CharField(max_length=20)
    confirmpass = models.CharField(max_length=20)

class Annonce(models.Model):
    titre = models.CharField(max_length=1000, default="Titre de l'annonce")
    annonce = models.TextField(max_length=10000)
    classe = models.ForeignKey(Classe)
    date = models.DateTimeField(auto_now=True)


class Transaction(models.Model):
    transaction_uid = models.CharField(max_length=1000, default="transaction_uid")
    transaction_confirmation_code = models.CharField(max_length=1000, default="transaction_confirmation_code")
    transaction_token = models.CharField(max_length=1000, default="transaction_token")
    transaction_provider_name = models.CharField(max_length=1000, default="transaction_provider_name")
    transaction_status = models.CharField(max_length=1000, default="transaction_status")

class Received(models.Model):
    transaction_merchant_secret = models.CharField(max_length=1000, default="transaction_merchant_secret")
    transaction_uid = models.CharField(max_length=1000, default="transaction_uid")
    transaction_token = models.CharField(max_length=1000, default="transaction_token")
    transaction_details = models.CharField(max_length=1000, default="transaction_details")
    transaction_amount = models.CharField(max_length=1000, default="transaction_amount")
    transaction_receiver_currency = models.CharField(max_length=1000, default="transaction_receiver_currency")
    transaction_status = models.CharField(max_length=1000, default="transaction_status")
    transaction_type = models.CharField(max_length=1000, default="transaction_type")

