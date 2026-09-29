import Foundation
import Vision
import AppKit
import CoreImage

let args = Array(CommandLine.arguments.dropFirst())
let outDir = args[0]
var result: [String: Any] = [:]
let ctx = CIContext()
for path in args.dropFirst() {
    guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let w = cg.width, h = cg.height
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    let faceReq = VNDetectFaceRectanglesRequest()
    let segReq = VNGeneratePersonSegmentationRequest()
    segReq.qualityLevel = .accurate
    segReq.outputPixelFormat = kCVPixelFormatType_OneComponent8
    do { try handler.perform([faceReq, segReq]) } catch { FileHandle.standardError.write("fail \(path): \(error)\n".data(using: .utf8)!) }
    var faces: [[Double]] = []
    for f in faceReq.results ?? [] {
        let bb = f.boundingBox
        faces.append([bb.origin.x * Double(w), (1 - bb.origin.y - bb.height) * Double(h), bb.width * Double(w), bb.height * Double(h)])
    }
    var maskFile = ""
    if let pb = segReq.results?.first?.pixelBuffer {
        let ci = CIImage(cvPixelBuffer: pb)
        let sx = Double(w) / ci.extent.width, sy = Double(h) / ci.extent.height
        let scaled = ci.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
        if let out = ctx.createCGImage(scaled, from: CGRect(x: 0, y: 0, width: w, height: h)) {
            let rep = NSBitmapImageRep(cgImage: out)
            let name = (path as NSString).lastPathComponent
            if let data = rep.representation(using: .png, properties: [:]) {
                try? data.write(to: URL(fileURLWithPath: outDir + "/" + name)); maskFile = name
            }
        }
    }
    result[(path as NSString).lastPathComponent] = ["w": w, "h": h, "faces": faces, "mask": maskFile]
}
let json = try! JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
print(String(data: json, encoding: .utf8)!)
