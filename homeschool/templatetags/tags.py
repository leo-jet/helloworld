from ..models import *
from django import template
import json

try:
    from urllib import quote_plus #python 2
except:
    pass

try:
    from urllib.parse import quote_plus #python 3
except:
    pass

register = template.Library()

@register.filter
def is_registered_in_classe(user, classe):
    if Inscription.objects.filter(classe=classe, eleve__user=user).first():
        return True
    else:
        return False

@register.filter
def est_enseignant(user):
    if Enseignant.objects.filter(user=user).first():
        return True
    else:
        return False

@register.filter
def nom_enseignant(user):
    if Enseignant.objects.filter(user=user).first():
        e = Enseignant.objects.filter(user=user).first()
        return "{} {}".format(e.nom, e.prenom)
    else:
        return "Vous n'êtes pas enseignant"

@register.filter
def situation_enseignant(user):
    if Enseignant.objects.filter(user=user).first():
        e = Enseignant.objects.filter(user=user).first()
        return "{}".format(e.situation)
    else:
        return "Vous n'êtes pas enseignant"

@register.filter
def masculin_enseignant(user):
    if Enseignant.objects.filter(user=user).first():
        e = Enseignant.objects.filter(user=user).first()
        if e.sexe == "Masculin":
            return True
        else:
            return False
    else:
        return False

@register.simple_tag
def compte_note(devoirID, user):
    devoir = Devoir.objects.filter(id=devoirID).first()
    feuille = FeuilleEleve.objects.filter(devoir=devoir, eleve=user).first()
    reponses = json.loads(feuille.reponses)
    n = feuille.devoir.quizz.questions.count()
    for idQuestion, propositions in reponses.items():
        trouve = True
        for idProposition, reponse in propositions.items():
            proposition = Proposition.objects.filter(idProposition=int(idProposition)).first()
            if reponse != proposition.solution:
                trouve = False
        if not trouve:
            n = n -1
    return int(n*100/feuille.devoir.quizz.questions.count())

@register.simple_tag
def compte_nombre_inscrit(classeID):
    return Inscription.objects.filter(classe__idClass=classeID).count()

@register.filter
def nombre_eleves_enseignant(user):
    if Enseignant.objects.filter(user=user).first():
        e = Enseignant.objects.filter(user=user).first()
        classes = Classe.objects.filter(enseignant=e)
        n = 0
        for classe in classes:
            n = n + compte_nombre_inscrit(classe.idClass)
        return n
    else:
        return "Vous n'êtes pas enseignant"

@register.simple_tag
def compte_debit(username):
    mesclasse = Classe.objects.filter(enseignant__user__username=username)
    credit = 0
    for classe in mesclasse:
        credit = credit + classe.prix*Inscription.objects.filter(classe=classe).count()
    return credit

@register.simple_tag
def compte_nombre_cours(username):
    return Classe.objects.filter(enseignant__user__username=username).count()


@register.filter
def urlify(value):
    return quote_plus(value)

