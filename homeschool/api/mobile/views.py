import json
from homeschool.forms import *
from django.http import HttpResponse, Http404

def get_cours_list(request):
    print(request.method)
    if request.method == "GET":
        cours = Classe.objects.all()
        mycours = []
        for cour in cours:
            c = {
                "name": cour.nom,
                "niveau": cour.niveau,
                "matiere": cour.matiere,
            }
            mycours.append(c)
        print(mycours)
        content = {
            "cours_list": mycours
        }
        return HttpResponse(json.dumps(content), content_type='application/json')
    else:
        raise Http404