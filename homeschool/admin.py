from django.contrib import admin
from homeschool.models import *
# Register your models here.

@admin.register(Eleve)
class EleveAdmin(admin.ModelAdmin):
    pass

@admin.register(Enseignant)
class EnseignantAdmin(admin.ModelAdmin):
    pass

@admin.register(GroupeDeSoutien)
class GroupeDeSoutienAdmin(admin.ModelAdmin):
    pass

@admin.register(Classe)
class ClasseAdmin(admin.ModelAdmin):
    pass

@admin.register(Inscription)
class InscriptionAdmin(admin.ModelAdmin):
    pass

@admin.register(Devoir)
class DevoirAdmin(admin.ModelAdmin):
    pass

@admin.register(Quizz)
class QuizzAdmin(admin.ModelAdmin):
    pass

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    pass

@admin.register(Proposition)
class PropositionAdmin(admin.ModelAdmin):
    pass

@admin.register(Chapitre)
class ChapitreAdmin(admin.ModelAdmin):
    pass

@admin.register(FeuilleEleve)
class FeuilleEleveAdmin(admin.ModelAdmin):
    list_display = ('eleve','reponses', 'get_quizz_titre', 'date')

    def get_quizz_titre(self, obj):
        return obj.devoir.quizz.intitule
    get_quizz_titre.short_description = "titreQuizz"

@admin.register(DemandeInscription)
class DemandeInscriptionAdmin(admin.ModelAdmin):
    pass

@admin.register(Basic_Information)
class Basic_InformationAdmin(admin.ModelAdmin):
    pass

@admin.register(Creation_Chapitre)
class Creation_ChapitreAdmin(admin.ModelAdmin):
    pass

@admin.register(Creation_Question)
class Creation_QuestionAdmin(admin.ModelAdmin):
    pass

@admin.register(Creation_TD)
class Creation_TDAdmin(admin.ModelAdmin):
    pass

@admin.register(EnseigneA)
class EnseigneAAdmin(admin.ModelAdmin):
    pass

@admin.register(ChapitreClasse)
class ChapitreClasseAdmin(admin.ModelAdmin):
    pass

@admin.register(TravauxDirigesClasse)
class TravauxDirigesClasseAdmin(admin.ModelAdmin):
    pass

@admin.register(ChapitreFait)
class ChapitreFaitAdmin(admin.ModelAdmin):
    pass

@admin.register(Annonce)
class AnnonceAdmin(admin.ModelAdmin):
    pass

@admin.register(PropositionRelationnelle)
class PropositionRelationnelleAdmin(admin.ModelAdmin):
    pass

@admin.register(PropositionSchema)
class PropositionSchemaAdmin(admin.ModelAdmin):
    pass

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass

@admin.register(Received)
class ReceivedAdmin(admin.ModelAdmin):
    pass