import os
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from PIL import Image

# --- Config ---
IMG_SIZE = (224, 224)
SAMPLE_RATE = 16000
DURATION = 3  # seconds
SAMPLES = SAMPLE_RATE * DURATION

# --- Function: Convert audio to spectrogram image ---
def audio_to_spectrogram(file_path, output_path):
    y, sr = librosa.load(file_path, sr=SAMPLE_RATE)
    if len(y) > SAMPLES:
        y = y[:SAMPLES]
    else:
        y = np.pad(y, (0, max(0, SAMPLES - len(y))))
    mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)

    plt.figure(figsize=(2.24, 2.24))
    librosa.display.specshow(log_mel_spec, sr=sr, x_axis='time', y_axis='mel')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
    plt.close()

# --- Convert full dataset to spectrograms ---
def convert_dataset_to_images(audio_dir, output_dir):
    for class_label in ['real', 'fake']:
        src_dir = os.path.join(audio_dir, class_label)
        out_class_dir = os.path.join(output_dir, class_label)
        os.makedirs(out_class_dir, exist_ok=True)
        for filename in os.listdir(src_dir):
            if filename.endswith(".wav") or filename.endswith(".mp3"):
                audio_path = os.path.join(src_dir, filename)
                output_img = os.path.join(out_class_dir, filename + ".png")
                audio_to_spectrogram(audio_path, output_img)

# --- Paths ---
audio_train = 'path/to/audio/train'
audio_val = 'path/to/audio/val'
img_train = 'temp/audio/train_images'
img_val = 'temp/audio/val_images'

# Convert audio to spectrograms
convert_dataset_to_images(audio_train, img_train)
convert_dataset_to_images(audio_val, img_val)

# --- Load pre-trained CNN (ResNet50) ---
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
for layer in base_model.layers[:-2]:
    layer.trainable = False
for layer in base_model.layers[-2:]:
    layer.trainable = True

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')  # binary classification
])

# --- Compile ---
model.compile(optimizer=Adam(learning_rate=1e-5), loss='binary_crossentropy', metrics=['accuracy'])

# --- Data generators ---
datagen = ImageDataGenerator(rescale=1./255)
train_generator = datagen.flow_from_directory(img_train, target_size=IMG_SIZE, batch_size=32, class_mode='binary')
val_generator = datagen.flow_from_directory(img_val, target_size=IMG_SIZE, batch_size=32, class_mode='binary')

# --- Train ---
model.fit(train_generator, epochs=10, validation_data=val_generator)

# --- Evaluate ---
loss, acc = model.evaluate(val_generator)
print(f"Audio Val Loss: {loss:.4f}, Accuracy: {acc:.4f}")
