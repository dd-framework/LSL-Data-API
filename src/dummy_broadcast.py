import time
import random
from pylsl import StreamInfo, StreamOutlet

marker_names = ["Head", "LeftHand", "RightHand", "LeftFoot", "RightFoot"]
num_markers = len(marker_names)

# Create stream information:
# - Name: "TestStream"
# - Type: "EEG" (or any type you choose)
# - Channel count: 8
# - Sampling rate: 10 Hz
# - Data type: float32
# - A unique identifier (uid)
exampleEEG = StreamInfo("ExampleEEG", "EEG", 8, 10, "float32", "exampleeeguid")
exampleMoCap = StreamInfo(
    "MockMoCap", "MoCap", num_markers * 6, 10, "float32", "mockmocapuid"
)

desc = exampleMoCap.desc()
setup = desc.append_child("setup")
markers = setup.append_child("markers")

for marker in marker_names:
    marker_node = markers.append_child("marker")
    marker_node.append_child_value("label", marker)

# Create an outlet to broadcast the stream.
outlet_exampleEEG = StreamOutlet(exampleEEG)
outlet_exampleMoCap = StreamOutlet(exampleMoCap)

eeg_current = [random.random() for _ in range(8)]
mocap_current = [random.uniform(-1.0, 1.0) for _ in range(num_markers * 6)]

eeg_offset = 0.5
mocap_offset = 0.2

anomaly_probability = 0.0013

print(f"Broadcasting LSL streams exampleEEG, exampleMoCap")
while True:
    # For each value in eeg_current, either add a large anomaly or a small offset
    eeg_current = [
        value
        + (
            random.choice([-20, 20])
            if random.random() < anomaly_probability
            else random.uniform(-1 * eeg_offset, eeg_offset)
        )
        for value in eeg_current
    ]
    mocap_current = [
        value
        + (
            random.choice([-20, 20])
            if random.random() < anomaly_probability
            else random.uniform(-1 * mocap_offset, mocap_offset)
        )
        for value in mocap_current
    ]

    outlet_exampleEEG.push_sample(eeg_current)
    outlet_exampleMoCap.push_sample(mocap_current)

    time.sleep(0.1)  # Adjust as necessary for your sampling rate.
