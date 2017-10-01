const Node = require('./node')

class MaxHeap {
  constructor () {
    this.root = null
    this.parentNodes = []
    this.currentSize = 0
  }

  push (data, priority) {
    const node = new Node(data, priority)
    this.currentSize++
    this.insertNode(node)
    this.shiftNodeUp(node)
  }

  pop () {
    if (!this.isEmpty()) {
      const detached = this.detachRoot()
      if (this.currentSize > 1) {
        this.restoreRootFromLastInsertedNode(detached)
        this.shiftNodeDown(this.root)
      } else {
        this.restoreRootFromLastInsertedNode({})
      }
      this.currentSize--
      return detached.data
    }
  }

  detachRoot () {
    const nodeIndex = this.parentNodes.indexOf(this.root)
    if (nodeIndex !== -1) {
      this.parentNodes.splice(nodeIndex, 1)
    }
    const detachRoot = this.root
    this.root = null
    return detachRoot
  }

  restoreRootFromLastInsertedNode (detached) {
    const lastInsertedNode = this.parentNodes.pop()

    if (lastInsertedNode && typeof detached !== 'undefined') {
      if (lastInsertedNode.parent !== null
        && lastInsertedNode.parent.right === lastInsertedNode
        && lastInsertedNode.parent !== detached) {
        this.parentNodes.unshift(lastInsertedNode.parent)
      }
      if (lastInsertedNode.parent !== null) {
        lastInsertedNode.parent.removeChild(lastInsertedNode)
      }
      lastInsertedNode.left = detached.left
      lastInsertedNode.right = detached.right
      if (lastInsertedNode.left) {
        lastInsertedNode.left.parent = lastInsertedNode
      }
      if (lastInsertedNode.right) {
        lastInsertedNode.right.parent = lastInsertedNode
      }
      if (detached.left === null || detached.right === null) {
        this.parentNodes.unshift(lastInsertedNode)
      }
      this.root = lastInsertedNode
    }
  }

  size () {
    return this.currentSize
  }

  isEmpty () {
    return this.root === null
  }

  clear () {
    this.root = null
    this.parentNodes = []
    this.currentSize = 0
  }

  insertNode (node) {
    if (this.root === null) {
      this.root = node
      this.parentNodes.push(node)
      return
    }
    if (this.parentNodes[0].left === null) {
      this.parentNodes[0].appendChild(node)
      this.parentNodes.push(node)
    } else {
      this.parentNodes[0].appendChild(node)
      this.parentNodes.push(node)
      this.parentNodes = this.parentNodes.slice(1, this.parentNodes.length)
    }
  }

  shiftNodeUp (node) {
    if (node.parent !== null) {
      if (node.parent.priority >= node.priority) {
        return
      }
      const nodeIndex = this.parentNodes.indexOf(node)
      const nodeParentIndex = this.parentNodes.indexOf(node.parent)
      if (nodeIndex !== -1) {
        if (nodeParentIndex !== -1) {
          const buf = this.parentNodes[nodeIndex]
          this.parentNodes[nodeIndex] = this.parentNodes[nodeParentIndex]
          this.parentNodes[nodeParentIndex] = buf
        } else {
          this.parentNodes[nodeIndex] = node.parent
        }
      }
      node.swapWithParent()
      this.shiftNodeUp(node)
    } else {
      this.root = node
    }
  }

  shiftNodeDown (node) {
    let nodeChild
    if (node.left !== null && node.right !== null) {
      if (node.left.priority > node.right.priority) {
        nodeChild = node.left
      } else {
        nodeChild = node.right
      }
    } else {
      if (node.left !== null && node.left.priority > node.priority) {
        nodeChild = node.left
      } else {
        return
      }
    }
    const nodeIndex = this.parentNodes.indexOf(node)
    const nodeChildIndex = this.parentNodes.indexOf(nodeChild)
    if (nodeChildIndex !== -1) {
      if (nodeIndex !== -1) {
        const buf = this.parentNodes[nodeIndex]
        this.parentNodes[nodeIndex] = this.parentNodes[nodeChildIndex]
        this.parentNodes[nodeChildIndex] = buf
      } else {
        this.parentNodes[nodeChildIndex] = node
      }
    }
    if (node === this.root) {
      this.root = nodeChild
    }
    nodeChild.swapWithParent()
    this.shiftNodeDown(node)
  }
}

module.exports = MaxHeap

