# iOS App Modernization Guide: Ocean Data Visualization

## Context

This guide outlines the modernization of an existing iOS ocean data visualization app to use the latest Swift and SwiftUI features as of 2024. The app will be updated to use Mapbox for mapping, modern state management, and follow best iOS development practices.

## Core Technologies & Requirements

- SwiftUI (Latest)
- Mapbox GL (Instead of MapKit)
- Modern Swift features (@Observable, async/await)
- URLSession for networking
- Widget support (future implementation)

## Architecture Overview

### State Management

```swift
@Observable
final class AppState {
    var selectedRegion: Region?
    var selectedDataset: Dataset?
    var selectedDate: Date?
    var activeLayers: Set<LayerType> = []

    static let shared = AppState()
    private init() {}
}

// Core Types
enum LayerType: String {
    case sst
    case waveHeight
    case bathymetry
    case stations
    case spots
}

struct Region: Identifiable, Codable {
    let id: String
    let name: String
    let bounds: [[Double]]
    let datasets: [Dataset]
}

struct Dataset: Identifiable, Codable {
    let id: String
    let name: String
    let category: String
    let timeRange: DateRange
}
```

### Network Layer

```swift
actor NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "https://api.yourservice.com"

    func fetch<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let url = baseURL.appendingPathComponent(endpoint.path)
        let request = URLRequest(url: url)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}

enum Endpoint {
    case regions
    case dataset(String)
    case stationData(String)

    var path: String {
        switch self {
        case .regions: return "/regions"
        case .dataset(let id): return "/datasets/\(id)"
        case .stationData(let id): return "/stations/\(id)"
        }
    }
}
```

### ViewModels

```swift
@Observable
final class MapViewModel {
    private var mapView: MapboxMapView?
    private var style: Style?

    var selectedRegion: Region? {
        didSet { updateMapRegion() }
    }

    var activeLayers: Set<LayerType> = [] {
        didSet { updateMapLayers() }
    }

    private func updateMapRegion() {
        guard let region = selectedRegion,
              let bounds = BoundingBox(coordinates: region.bounds) else {
            return
        }

        mapView?.camera.ease(
            to: CameraOptions(center: bounds.center, zoom: bounds.zoom),
            duration: 0.5
        )
    }

    private func updateMapLayers() {
        guard let style = style else { return }

        activeLayers.forEach { layerType in
            switch layerType {
            case .sst:
                updateSSTLayer(style)
            case .waveHeight:
                updateWaveHeightLayer(style)
            // ... other layer updates
            }
        }
    }
}

@Observable
final class RegionViewModel {
    private let networkManager: NetworkManager
    var regions: [Region] = []
    var isLoading = false
    var error: Error?

    init(networkManager: NetworkManager = .shared) {
        self.networkManager = networkManager
    }

    func loadRegions() async {
        isLoading = true
        defer { isLoading = false }

        do {
            regions = try await networkManager.fetch(.regions)
        } catch {
            self.error = error
        }
    }
}
```

### Views

```swift
struct MainView: View {
    @State private var regionVM = RegionViewModel()
    @State private var datasetVM = DatasetViewModel()
    @State private var mapVM = MapViewModel()

    var body: some View {
        NavigationSplitView {
            SidebarView(viewModel: regionVM)
        } detail: {
            MapContentView(viewModel: mapVM)
        }
    }
}

struct SidebarView: View {
    @Bindable var viewModel: RegionViewModel

    var body: some View {
        List(viewModel.regions) { region in
            RegionRow(region: region)
                .onTapGesture {
                    AppState.shared.selectedRegion = region
                }
        }
        .task {
            await viewModel.loadRegions()
        }
    }
}

struct LayerControlsView: View {
    @Binding var activeLayers: Set<LayerType>

    var body: some View {
        List(LayerType.allCases, id: \.self) { layer in
            Toggle(layer.displayName, isOn: binding(for: layer))
        }
    }
}
```

## Integration Guidelines

### Existing App Integration

1. Identify and update existing network calls to use the new NetworkManager
2. Replace existing state management with the new @Observable pattern
3. Gradually migrate views to SwiftUI while maintaining existing UIKit views
4. Update existing map implementation to use Mapbox
5. Consolidate duplicate logic and standardize data models

### Best Practices

1. Use Swift concurrency (async/await) for all asynchronous operations
2. Implement proper error handling and loading states
3. Follow MVVM architecture pattern
4. Use dependency injection for better testability
5. Implement proper memory management
6. Add comprehensive logging and analytics
7. Ensure accessibility compliance

### Performance Considerations

1. Implement proper caching strategies
2. Optimize map layer updates
3. Use lazy loading for list views
4. Implement proper background task handling
5. Optimize network requests and responses

### Testing Strategy

1. Unit tests for ViewModels
2. Integration tests for NetworkManager
3. UI tests for critical user flows
4. Performance testing for map interactions
5. Network request mocking

## Implementation Steps

1. **Setup Phase**

   - Update project to use latest Swift version
   - Add Mapbox SDK dependencies
   - Setup basic project structure

2. **Core Implementation**

   - Implement NetworkManager
   - Setup AppState
   - Create base ViewModels
   - Setup Mapbox integration

3. **View Migration**

   - Create new SwiftUI views
   - Setup navigation structure
   - Implement layer controls
   - Create map interaction handlers

4. **Integration**

   - Merge existing functionality
   - Update network calls
   - Migrate state management
   - Update data models

5. **Testing & Optimization**
   - Write unit tests
   - Perform UI testing
   - Optimize performance
   - Add analytics

## Notes for LLM Implementation

When implementing this modernization:

1. Always check for the latest Swift syntax and features
2. Consider backward compatibility requirements
3. Maintain existing functionality while improving architecture
4. Follow iOS platform guidelines and best practices
5. Consider memory management and performance implications
6. Implement proper error handling and user feedback
7. Ensure accessibility features are maintained or improved
8. Consider localization requirements
9. Implement proper logging and debugging capabilities
10. Follow security best practices

Remember to:

- Keep existing app functionality while modernizing
- Use incremental migration approach
- Maintain backward compatibility where needed
- Document all major changes
- Update test coverage for new implementations
