from django.urls import path

from .views import (
    FileListView, FileUploadView, FileDetailView,
    FileRenameView, FileCommentView, FileShareView,
    FileDownloadView, ShareLinkDownloadView
)

urlpatterns = [
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('files/<int:pk>/rename/', FileRenameView.as_view(), name='file-rename'),
    path('files/<int:pk>/comment/', FileCommentView.as_view(), name='file-comment'),
    path('files/<int:pk>/share/', FileShareView.as_view(), name='file-share'),
    path('files/<int:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    
    path('share/<str:share_link>/', ShareLinkDownloadView.as_view(), name='share-download'),
]
