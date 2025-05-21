import collections
import numpy as np
import copy


# region Classes and Setup

# Initialize a dictionary to hold rolling statistics for each channel.
channel_stats = {}


# Class to maintain rolling statistics during anomaly detection
class RollingStats:
    def __init__(self, window_size):
        self.window_size = window_size
        self.values = collections.deque(maxlen=window_size)

    def update(self, value):
        self.values.append(value)

    def mean(self):
        return np.mean(self.values) if self.values else 0

    def std(self):
        return np.std(self.values) if self.values else 0


# region Is Anomaly Value


# Actually does the calculation for whether or not a value seems anomalous
def is_anomaly_value(value, stats, threshold=3):
    # Only decide if the rolling window is full enough
    if len(stats.values) < stats.window_size:
        return False
    # Convert value to a numpy array in case it's a list
    value_arr = np.asarray(value)
    # Compute the absolute difference between the current value and the mean
    diff = np.abs(value_arr - stats.mean())
    # Return True if any element exceeds the threshold, otherwise False
    return np.any(diff > threshold * stats.std())


# region Detect Anomaly


# Returns a point that represents the anomaly-ness of the initially passed-in point
def detect_anomaly(source_data, data_point):
    global channel_stats

    anomaly_threshold = source_data["LSL_Data_API_Status"]["ddStatus"][
        "Anomaly Threshold"
    ]
    rolling_window_size = source_data["LSL_Data_API_Status"]["ddStatus"][
        "Anomaly Window"
    ]
    anomaly_point = copy.deepcopy(data_point)

    # Check if this is mocap data (with a 'points' dict) or EEG data (channels at top level)
    if "points" in data_point:
        # For mocap data, process each point (e.g., 'Head', 'LeftHand', etc.)
        for channel, value in data_point["points"].items():
            if channel not in channel_stats:
                channel_stats[channel] = RollingStats(rolling_window_size)
            channel_stats[channel].update(value)
            if is_anomaly_value(value, channel_stats[channel], anomaly_threshold):
                anomaly_point["points"][channel] = 1
                # print(f"Anomaly detected in {channel}: {value}")
            else:
                anomaly_point["points"][channel] = 0
    else:
        # For EEG or similar data, assume channels are prefixed with 'ch_'
        for key, value in data_point.items():
            if key.startswith("ch_"):
                if key not in channel_stats:
                    channel_stats[key] = RollingStats(rolling_window_size)
                channel_stats[key].update(value)
                if is_anomaly_value(value, channel_stats[key], anomaly_threshold):
                    anomaly_point[key] = 1
                    # print(f"Anomaly detected in {key}: {value}")
                else:
                    anomaly_point[key] = 0

    return anomaly_point
