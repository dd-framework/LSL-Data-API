# region EEG Creator Getter


# Returns a function that can turn a sample and timestamp of an EEG stream into a data point
def get_data_point_creator_EEG(stream_info):
    channel_count = stream_info.channel_count()
    try:
        channels_xml = stream_info.desc().child("channels")
        channel_labels = []
        for i in range(channel_count):
            try:
                label = channels_xml.child("channel", i).child_value("label")
                if not label:
                    label = f"ch_{i}"
            except Exception:
                label = f"ch_{i}"
            channel_labels.append(label)
    except Exception:
        channel_labels = [f"ch_{i}" for i in range(channel_count)]

    def creation_function(sample, timestamp):
        return {
            "name": timestamp,
            **{channel_labels[i]: sample[i] for i in range(len(sample))},
        }

    return creation_function


# region MoCap Creator Getter


# Returns a function that can turn a sample and timestamp of a MoCap stream into a data point
def get_data_point_creator_MoCap(stream_info):
    channel_count = stream_info.channel_count()

    # Try extracting marker names from stream_info metadata
    try:
        markers_xml = stream_info.desc().child("setup").child("markers")

        marker_labels = []
        marker = markers_xml.first_child()  # Get the first child inside <markers>
        index = 0

        while (
            marker and index < channel_count // 6
        ):  # Keep looping while marker is valid and you are not obviously out of bounds

            if marker.name() == "marker":  # Make sure it's a <marker> element
                label = marker.child_value("label")  # Extract label
                if not label:
                    label = f"marker_{len(marker_labels)}"  # Default name if missing
                marker_labels.append(label)

            marker = marker.next_sibling()
            index += 1

    except Exception as e:
        print(f"Error extracting marker labels: {e}")
        marker_labels = [f"marker_{i}" for i in range(channel_count // 6)]

    if len(marker_labels) == 0:
        marker_labels = [f"marker_{i}" for i in range(channel_count // 6)]

    # Determine number of dimensions per marker
    num_markers = len(marker_labels)
    channels_per_marker = channel_count // num_markers

    def creation_function(sample, timestamp):
        points = {}
        for i, marker in enumerate(marker_labels):
            start_idx = i * channels_per_marker
            points[marker] = sample[start_idx : start_idx + channels_per_marker]

        return {"name": timestamp, "points": points}

    return creation_function


# region General Creator Getter


# Get Data Point Constructor based on Stream Type and Info
def get_data_point_creator(stream_type, stream_info):
    if stream_type == "EEG":
        return get_data_point_creator_EEG(stream_info)
    elif stream_type == "MOCAP":
        return get_data_point_creator_MoCap(stream_info)
