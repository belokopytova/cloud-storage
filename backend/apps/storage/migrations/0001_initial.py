from django.db import migrations, models
import django.db.models.deletion


def create_storage_dir(apps, schema_editor):
    import os
    from pathlib import Path
    root = Path(__file__).resolve().parents[2] / 'storage'
    root.mkdir(parents=True, exist_ok=True)


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_storage_dir, reverse_code=migrations.RunPython.noop),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('original_name', models.CharField(max_length=255, verbose_name='Оригинальное имя')),
                ('stored_name', models.CharField(max_length=255, unique=True, verbose_name='Имя в хранилище')),
                ('file_path', models.CharField(max_length=500, verbose_name='Путь к файлу')),
                ('comment', models.TextField(blank=True, default='', verbose_name='Комментарий')),
                ('size', models.BigIntegerField(verbose_name='Размер файла (в байтах)')),
                ('upload_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')),
                ('last_download_date', models.DateTimeField(blank=True, null=True, verbose_name='Дата последнего скачивания')),
                ('share_link', models.CharField(blank=True, max_length=255, null=True, unique=True, verbose_name='Ссылка для общего доступа')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='Удален')),
                ('deleted_at', models.DateTimeField(blank=True, null=True, verbose_name='Дата удаления')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='users.user', verbose_name='Владелец')),
            ],
            options={
                'verbose_name': 'Файл',
                'verbose_name_plural': 'Файлы',
                'db_table': 'files',
                'ordering': ['-upload_date'],
            },
        ),
        migrations.AddIndex(
            model_name='file',
            index=models.Index(fields=['user', 'upload_date'], name='storage_fil_user_id_5ec44f_idx'),
        ),
    ]
