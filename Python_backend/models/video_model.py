import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import LSTM, TimeDistributed, Dense, Dropout, GlobalAveragePooling2D, Input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.optimizers import Adam

# --- Config ---
IMG_SIZE = (224, 224)
SEQUENCE_LENGTH = 10  # number of frames per video
BATCH_SIZE = 4

# --- Feature extractor: ResNet50 (freeze all but last 2 layers) ---
base_cnn = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
for layer in base_cnn.layers[:-2]:
    layer.trainable = False
for layer in base_cnn.layers[-2:]:
    layer.trainable = True

cnn_model = Sequential([
    base_cnn,
    GlobalAveragePooling2D()
])

# --- Load a sequence of frames from a folder ---
def load_video_sequence(folder_path):
    frame_files = sorted(os.listdir(folder_path))[:SEQUENCE_LENGTH]
    frames = []
    for file in frame_files:
        img_path = os.path.join(folder_path, file)
        img = load_img(img_path, target_size=IMG_SIZE)
        img_array = img_to_array(img) / 255.0
        frames.append(img_array)
    while len(frames) < SEQUENCE_LENGTH:  # pad with last frame if not enough
        frames.append(frames[-1])
    return np.array(frames)

# --- Load all video sequences from directory ---
def load_dataset(video_root_dir):
    X, y = [], []
    for label, class_name in enumerate(['real', 'fake']):
        class_dir = os.path.join(video_root_dir, class_name)
        for video_folder in os.listdir(class_dir):
            folder_path = os.path.join(class_dir, video_folder)
            if os.path.isdir(folder_path):
                video = load_video_sequence(folder_path)
                X.append(video)
                y.append(label)
    return np.array(X), np.array(y)

# --- Load data ---
train_dir = 'path/to/dataset/train'
val_dir = 'path/to/dataset/val'
X_train, y_train = load_dataset(train_dir)
X_val, y_val = load_dataset(val_dir)

# --- Build Model ---
input_shape = (SEQUENCE_LENGTH, 224, 224, 3)
model_input = Input(shape=input_shape)

x = TimeDistributed(cnn_model)(model_input)
x = LSTM(128, return_sequences=False)(x)
x = Dropout(0.5)(x)
x = Dense(64, activation='relu')(x)
x = Dense(1, activation='sigmoid')(x)

model = Model(inputs=model_input, outputs=x)
model.compile(optimizer=Adam(learning_rate=1e-5), loss='binary_crossentropy', metrics=['accuracy'])

# --- Train ---
model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=10, batch_size=BATCH_SIZE)

# --- Evaluate ---
loss, acc = model.evaluate(X_val, y_val)
print(f"Video Val Loss: {loss:.4f}, Accuracy: {acc:.4f}")
