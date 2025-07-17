from .stub import Types


def test_initialize_chain(patch_services_retriever, patch_chain_module_dependencies):
    from services.chain_multimodal import chain

    chain_instance = chain.initialize_chain()
    assert Types.RUNNABLE_SEQUENCE in str(type(chain_instance))
