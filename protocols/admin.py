from django.contrib import admin
from .models import Protocol, Topic, Institution


class ProtocolAdminIndex(admin.ModelAdmin):
    list_display = ['number', 'start_time', 'get_topics', 'information', 'majority', 'current_majority', 'institution']

    list_display_links = ['number']

    list_filter = ['institution__name', 'topics']

    search_fields =['number', 'institution__name', 'topics__name', 'information']


class TopicAdminIndex(admin.ModelAdmin):

    list_display = ['name', 'voted_for', 'voted_against', 'voted_abstain', 'protocol']

    list_filter = ['protocol__number']

    search_fields =['name', 'protocol__number']

admin.site.register(Institution)
admin.site.register(Topic, TopicAdminIndex)
admin.site.register(Protocol, ProtocolAdminIndex)
